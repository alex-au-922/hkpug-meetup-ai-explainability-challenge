from __future__ import annotations

import json
from pathlib import Path

import pytest

from challenge.rubric import RUBRIC, RUBRIC_BY_ID
from challenge.scorer import (
    PARTICIPANT_ID_RE,
    render_markdown_summary,
    score_mission,
    score_submission_root,
)

ROOT = Path(__file__).resolve().parents[1]
EXAMPLE_SUBMISSIONS = ROOT / "examples" / "ct-alex-au" / "submissions"


def test_example_submission_scores_full_marks() -> None:
    result = score_submission_root(EXAMPLE_SUBMISSIONS, "AIEX-CT-ALEX-AU")

    assert result.points == 100
    assert result.max_points == 100
    assert not result.errors
    assert all(not mission.errors for mission in result.missions)


def test_markdown_summary_contains_mission_table() -> None:
    result = score_submission_root(EXAMPLE_SUBMISSIONS, "AIEX-CT-ALEX-AU")

    summary = render_markdown_summary(result)

    assert "# Score for AIEX-CT-ALEX-AU" in summary
    assert "| mission-01 | 10/10 | OK |" in summary


def test_rubric_stays_automated_and_hard() -> None:
    mission_10 = RUBRIC_BY_ID["mission-10"]

    assert len(RUBRIC) == 10
    assert sum(mission.max_points for mission in RUBRIC) == 100
    assert all(mission.max_points == 10 for mission in RUBRIC)
    assert len(mission_10.checks) == 10


def test_invalid_participant_id_is_rejected() -> None:
    assert PARTICIPANT_ID_RE.fullmatch("AIEX-TEAM-01")
    assert not PARTICIPANT_ID_RE.fullmatch("aiex-team-01")


def test_missing_mission_is_reported(tmp_path: Path) -> None:
    participant_dir = tmp_path / "AIEX-TINY"
    participant_dir.mkdir()
    payload = {
        "participant_id": "AIEX-TINY",
        "mission_id": "mission-01",
        "answer": {
            "shap_scope": "model prediction",
            "opik_scope": "llm trace",
        },
        "evidence": [
            "SHAP helps because prediction debugging needs feature "
            "contribution evidence.",
            "Opik helps when the AI answer is wrong because the trace shows "
            "pipeline failure.",
        ],
    }
    (participant_dir / "mission-01.json").write_text(
        json.dumps(payload),
        encoding="utf-8",
    )

    result = score_submission_root(tmp_path, "AIEX-TINY")

    assert result.points == 10
    assert result.max_points == 100
    assert result.missions[1].errors == ("missing mission-02.json",)


def test_capstone_requires_cross_artifact_evidence() -> None:
    shallow_payload = {
        "participant_id": "AIEX-TINY",
        "mission_id": "mission-10",
        "answer": {
            "incident_type": "retrieval context mismatch",
            "shap_lesson": "SHAP explains feature contribution.",
            "opik_lesson": "Opik explains traces.",
            "next_action": "add test coverage and monitor the app.",
        },
        "evidence": [
            "SHAP and Opik are useful together because they explain different "
            "parts of an AI system."
        ],
    }

    result = score_mission(RUBRIC_BY_ID["mission-10"], shallow_payload)

    assert result.points < result.max_points
    assert result.points == 2


def test_multiple_participant_folders_require_selection(tmp_path: Path) -> None:
    (tmp_path / "AIEX-ONE").mkdir()
    (tmp_path / "AIEX-TWO").mkdir()

    with pytest.raises(ValueError, match="multiple participant folders"):
        score_submission_root(tmp_path)
