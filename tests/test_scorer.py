from __future__ import annotations

import json
from pathlib import Path

import pytest

from challenge.scorer import (
    PARTICIPANT_ID_RE,
    render_markdown_summary,
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


def test_multiple_participant_folders_require_selection(tmp_path: Path) -> None:
    (tmp_path / "AIEX-ONE").mkdir()
    (tmp_path / "AIEX-TWO").mkdir()

    with pytest.raises(ValueError, match="multiple participant folders"):
        score_submission_root(tmp_path)
