from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from challenge.rubric import RUBRIC, RUBRIC_BY_ID, Check, MissionRubric

PARTICIPANT_ID_RE = re.compile(r"^AIEX-[A-Z0-9][A-Z0-9-]{2,40}$")


@dataclass(frozen=True)
class CheckResult:
    label: str
    points: int
    max_points: int
    passed: bool


@dataclass(frozen=True)
class MissionResult:
    mission_id: str
    title: str
    points: int
    max_points: int
    checks: tuple[CheckResult, ...]
    errors: tuple[str, ...]


@dataclass(frozen=True)
class ScoreResult:
    participant_id: str
    points: int
    max_points: int
    missions: tuple[MissionResult, ...]
    errors: tuple[str, ...]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Score HKPUG AIEX submissions.")
    parser.add_argument(
        "--submission-root",
        type=Path,
        default=Path("submissions"),
        help="Directory containing participant submission folders.",
    )
    parser.add_argument(
        "--participant-id",
        help="Optional participant ID to score. Defaults to the only folder found.",
    )
    parser.add_argument(
        "--result",
        type=Path,
        help="Optional JSON output path.",
    )
    parser.add_argument(
        "--fail-under",
        type=int,
        default=0,
        help="Exit non-zero if the score percentage is lower than this value.",
    )
    parser.add_argument(
        "--require-complete",
        action="store_true",
        help="Exit non-zero when any mission file is missing.",
    )
    return parser.parse_args()


def score_submission_root(
    submission_root: Path,
    participant_id: str | None = None,
) -> ScoreResult:
    selected_id, participant_dir = resolve_participant_dir(
        submission_root, participant_id
    )
    payloads, load_errors = load_payloads(participant_dir)
    mission_results = tuple(
        score_mission(mission, payloads.get(mission.mission_id))
        for mission in RUBRIC
    )
    points = sum(mission.points for mission in mission_results)
    max_points = sum(mission.max_points for mission in mission_results)
    errors = tuple(load_errors)
    return ScoreResult(
        participant_id=selected_id,
        points=points,
        max_points=max_points,
        missions=mission_results,
        errors=errors,
    )


def resolve_participant_dir(
    submission_root: Path,
    participant_id: str | None,
) -> tuple[str, Path]:
    if participant_id is not None:
        if not PARTICIPANT_ID_RE.fullmatch(participant_id):
            raise ValueError(
                "participant ID must look like AIEX-TEAM-NAME using uppercase "
                "letters, digits, and dashes"
            )
        participant_dir = submission_root / participant_id
        if not participant_dir.is_dir():
            raise FileNotFoundError(
                f"participant folder was not found: {participant_dir}"
            )
        return participant_id, participant_dir

    participant_dirs = [
        path
        for path in sorted(submission_root.iterdir())
        if path.is_dir() and PARTICIPANT_ID_RE.fullmatch(path.name)
    ]
    if not participant_dirs:
        raise FileNotFoundError(
            f"no participant folders found under {submission_root}; expected AIEX-*"
        )
    if len(participant_dirs) > 1:
        names = ", ".join(path.name for path in participant_dirs)
        raise ValueError(
            "multiple participant folders found; pass --participant-id. "
            f"Found: {names}"
        )
    return participant_dirs[0].name, participant_dirs[0]


def load_payloads(participant_dir: Path) -> tuple[dict[str, dict[str, Any]], list[str]]:
    payloads: dict[str, dict[str, Any]] = {}
    errors: list[str] = []
    for path in sorted(participant_dir.glob("mission-*.json")):
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as error:
            errors.append(f"{path.name}: invalid JSON: {error}")
            continue

        mission_id = payload.get("mission_id")
        if not isinstance(mission_id, str):
            errors.append(f"{path.name}: mission_id must be a string")
            continue
        if mission_id not in RUBRIC_BY_ID:
            errors.append(f"{path.name}: unknown mission_id {mission_id!r}")
            continue
        if mission_id in payloads:
            errors.append(f"{path.name}: duplicate payload for {mission_id}")
            continue
        payloads[mission_id] = payload
    return payloads, errors


def score_mission(
    rubric: MissionRubric,
    payload: dict[str, Any] | None,
) -> MissionResult:
    if payload is None:
        return MissionResult(
            mission_id=rubric.mission_id,
            title=rubric.title,
            points=0,
            max_points=rubric.max_points,
            checks=(),
            errors=(f"missing {rubric.mission_id}.json",),
        )

    errors = validate_payload_shape(rubric.mission_id, payload)
    checks = tuple(score_check(payload, check) for check in rubric.checks)
    points = sum(check.points for check in checks)
    return MissionResult(
        mission_id=rubric.mission_id,
        title=rubric.title,
        points=points,
        max_points=rubric.max_points,
        checks=checks,
        errors=tuple(errors),
    )


def validate_payload_shape(mission_id: str, payload: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    if payload.get("mission_id") != mission_id:
        errors.append(f"mission_id must be {mission_id!r}")
    participant_id = payload.get("participant_id")
    if not isinstance(participant_id, str) or not PARTICIPANT_ID_RE.fullmatch(
        participant_id
    ):
        errors.append("participant_id must look like AIEX-TEAM-NAME")
    if not isinstance(payload.get("answer"), dict):
        errors.append("answer must be an object")
    evidence = payload.get("evidence")
    if not isinstance(evidence, list) or not all(
        isinstance(item, str) for item in evidence
    ):
        errors.append("evidence must be a list of strings")
    return errors


def score_check(payload: dict[str, Any], check: Check) -> CheckResult:
    value = value_at_path(payload, check.path)
    text = flatten_text(value)
    passed = True

    if check.min_words and word_count(text) < check.min_words:
        passed = False
    if check.any_of and not contains_any(text, check.any_of):
        passed = False
    if check.all_of and not contains_all(text, check.all_of):
        passed = False

    points = check.points if passed else 0
    return CheckResult(
        label=check.label,
        points=points,
        max_points=check.points,
        passed=passed,
    )


def value_at_path(payload: dict[str, Any], path: tuple[str, ...]) -> Any:
    current: Any = payload
    for key in path:
        if not isinstance(current, dict) or key not in current:
            return None
        current = current[key]
    return current


def flatten_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    if isinstance(value, list):
        return " ".join(flatten_text(item) for item in value)
    if isinstance(value, dict):
        return " ".join(flatten_text(item) for item in value.values())
    return str(value)


def normalize(text: str) -> str:
    return re.sub(r"[^a-z0-9_.-]+", " ", text.lower()).strip()


def contains_any(text: str, needles: tuple[str, ...]) -> bool:
    normalized = normalize(text)
    return any(normalize(needle) in normalized for needle in needles)


def contains_all(text: str, needles: tuple[str, ...]) -> bool:
    normalized = normalize(text)
    return all(normalize(needle) in normalized for needle in needles)


def word_count(text: str) -> int:
    return len(re.findall(r"[A-Za-z0-9_.-]+", text))


def result_to_dict(result: ScoreResult) -> dict[str, Any]:
    return {
        "participant_id": result.participant_id,
        "points": result.points,
        "max_points": result.max_points,
        "percentage": round(result.points / result.max_points * 100, 2),
        "errors": list(result.errors),
        "missions": [
            {
                "mission_id": mission.mission_id,
                "title": mission.title,
                "points": mission.points,
                "max_points": mission.max_points,
                "errors": list(mission.errors),
                "checks": [
                    {
                        "label": check.label,
                        "points": check.points,
                        "max_points": check.max_points,
                        "passed": check.passed,
                    }
                    for check in mission.checks
                ],
            }
            for mission in result.missions
        ],
    }


def render_markdown_summary(result: ScoreResult) -> str:
    percentage = result.points / result.max_points * 100
    lines = [
        f"# Score for {result.participant_id}",
        "",
        f"Total: **{result.points}/{result.max_points}** ({percentage:.1f}%)",
        "",
        "| Mission | Score | Notes |",
        "|---|---:|---|",
    ]
    for mission in result.missions:
        notes = "; ".join(mission.errors)
        if not notes:
            failed = [check.label for check in mission.checks if not check.passed]
            notes = "OK" if not failed else "Missing: " + "; ".join(failed)
        score = f"{mission.points}/{mission.max_points}"
        lines.append(f"| {mission.mission_id} | {score} | {notes} |")
    if result.errors:
        lines.extend(["", "## File Errors", ""])
        lines.extend(f"- {error}" for error in result.errors)
    return "\n".join(lines)


def main() -> int:
    args = parse_args()
    try:
        result = score_submission_root(args.submission_root, args.participant_id)
    except (FileNotFoundError, ValueError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 2

    if args.result is not None:
        args.result.parent.mkdir(parents=True, exist_ok=True)
        args.result.write_text(
            json.dumps(result_to_dict(result), indent=2) + "\n",
            encoding="utf-8",
        )

    print(render_markdown_summary(result))

    percentage = result.points / result.max_points * 100
    has_blocking_errors = bool(result.errors) or any(
        mission_has_blocking_errors(mission, require_complete=args.require_complete)
        for mission in result.missions
    )
    if has_blocking_errors:
        return 1
    if args.fail_under and percentage < args.fail_under:
        return 1
    return 0


def mission_has_blocking_errors(
    mission: MissionResult,
    *,
    require_complete: bool,
) -> bool:
    if require_complete:
        return bool(mission.errors)
    return any(not error.startswith("missing mission-") for error in mission.errors)


if __name__ == "__main__":
    raise SystemExit(main())
