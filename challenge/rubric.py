from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Check:
    path: tuple[str, ...]
    points: int
    label: str
    any_of: tuple[str, ...] = ()
    all_of: tuple[str, ...] = ()
    min_words: int = 0


@dataclass(frozen=True)
class MissionRubric:
    mission_id: str
    title: str
    checks: tuple[Check, ...]

    @property
    def max_points(self) -> int:
        return sum(check.points for check in self.checks)


RUBRIC: tuple[MissionRubric, ...] = (
    MissionRubric(
        mission_id="mission-01",
        title="SHAP and Opik are not the same tool",
        checks=(
            Check(
                path=("answer", "shap_scope"),
                points=3,
                label="SHAP is tied to one model prediction",
                any_of=("prediction", "feature contribution", "model output"),
            ),
            Check(
                path=("answer", "opik_scope"),
                points=3,
                label="Opik is tied to the AI app trace or pipeline",
                any_of=("trace", "pipeline", "llm", "rag", "agent"),
            ),
            Check(
                path=("evidence",),
                points=4,
                label="Evidence explains the difference in plain language",
                min_words=22,
                all_of=("because", "wrong"),
            ),
        ),
    ),
    MissionRubric(
        mission_id="mission-02",
        title="Read a global SHAP summary",
        checks=(
            Check(
                path=("answer", "top_global_feature"),
                points=4,
                label="Top global feature is late_payments",
                any_of=("late_payments", "late payments"),
            ),
            Check(
                path=("answer", "second_global_feature"),
                points=2,
                label="Second feature is credit_utilization",
                any_of=("credit_utilization", "credit utilization"),
            ),
            Check(
                path=("evidence",),
                points=4,
                label="Evidence mentions mean absolute SHAP",
                min_words=18,
                any_of=("mean absolute", "average absolute", "largest bar"),
            ),
        ),
    ),
    MissionRubric(
        mission_id="mission-03",
        title="Explain one wrong prediction",
        checks=(
            Check(
                path=("answer", "case_id"),
                points=2,
                label="Case C-104 is selected",
                any_of=("c-104",),
            ),
            Check(
                path=("answer", "pushes_risk_up"),
                points=4,
                label="Risk-up factors are named",
                all_of=("late_payments", "credit_utilization"),
            ),
            Check(
                path=("answer", "pushes_risk_down"),
                points=2,
                label="Risk-down factor is named",
                any_of=("stable_income", "income", "employment_months"),
            ),
            Check(
                path=("evidence",),
                points=2,
                label="Evidence uses push-up / push-down wording",
                any_of=("pushed up", "pushed down", "lowered", "raised"),
            ),
        ),
    ),
    MissionRubric(
        mission_id="mission-04",
        title="Spot a SHAP interpretation trap",
        checks=(
            Check(
                path=("answer", "suspicious_feature"),
                points=4,
                label="Suspicious feature is post_approval_call_count",
                any_of=("post_approval_call_count", "post approval call count"),
            ),
            Check(
                path=("answer", "trap_type"),
                points=3,
                label="Trap is data leakage",
                any_of=("leakage", "leaks", "future data"),
            ),
            Check(
                path=("evidence",),
                points=3,
                label=(
                    "Evidence explains why the feature is not available at "
                    "decision time"
                ),
                all_of=("after", "decision"),
            ),
        ),
    ),
    MissionRubric(
        mission_id="mission-05",
        title="Write a model incident note",
        checks=(
            Check(
                path=("answer", "symptom"),
                points=2,
                label="Symptom is stated",
                min_words=6,
            ),
            Check(
                path=("answer", "root_cause"),
                points=3,
                label="Root cause mentions leakage or over-trust",
                any_of=("leakage", "over-trust", "wrong feature", "shortcut"),
            ),
            Check(
                path=("answer", "fix"),
                points=3,
                label="Fix removes or audits the bad feature",
                any_of=("remove", "drop", "audit", "retrain"),
            ),
            Check(
                path=("evidence",),
                points=2,
                label="Evidence is specific enough to review",
                min_words=20,
            ),
        ),
    ),
    MissionRubric(
        mission_id="mission-06",
        title="Read an Opik-style trace",
        checks=(
            Check(
                path=("answer", "failing_trace_id"),
                points=3,
                label="Failing trace is trace-003",
                any_of=("trace-003",),
            ),
            Check(
                path=("answer", "bad_step"),
                points=3,
                label="Bad step is retrieval",
                any_of=("retrieval", "retriever"),
            ),
            Check(
                path=("answer", "failed_metric"),
                points=2,
                label="Failed metric is context relevance",
                any_of=("context_relevance", "context relevance"),
            ),
            Check(
                path=("evidence",),
                points=2,
                label="Evidence says the model got the wrong context",
                any_of=("wrong context", "irrelevant context", "venue wifi"),
            ),
        ),
    ),
    MissionRubric(
        mission_id="mission-07",
        title="Turn a trace failure into an evaluation",
        checks=(
            Check(
                path=("answer", "dataset_item"),
                points=3,
                label="Dataset item is weather-refund-policy",
                any_of=("weather-refund-policy", "weather refund policy"),
            ),
            Check(
                path=("answer", "metric_to_watch"),
                points=3,
                label="Metric is answer correctness or context relevance",
                any_of=("answer_correctness", "context_relevance", "relevance"),
            ),
            Check(
                path=("answer", "regression_rule"),
                points=2,
                label="Regression rule says the case should fail if score drops",
                any_of=("fail", "block", "alert", "regression"),
            ),
            Check(
                path=("evidence",),
                points=2,
                label="Evidence links trace to repeatable testing",
                any_of=("test", "dataset", "repeat"),
            ),
        ),
    ),
    MissionRubric(
        mission_id="mission-08",
        title="Compare before and after traces",
        checks=(
            Check(
                path=("answer", "before_trace_id"),
                points=2,
                label="Before trace is trace-003",
                any_of=("trace-003",),
            ),
            Check(
                path=("answer", "after_trace_id"),
                points=2,
                label="After trace is trace-004",
                any_of=("trace-004",),
            ),
            Check(
                path=("answer", "changed_component"),
                points=3,
                label="Changed component is retrieval or prompt routing",
                any_of=("retrieval", "router", "prompt"),
            ),
            Check(
                path=("evidence",),
                points=3,
                label="Evidence compares metric improvement",
                any_of=("0.22 to 0.91", "improved", "pass"),
            ),
        ),
    ),
    MissionRubric(
        mission_id="mission-09",
        title="Stay inside the safe workshop boundary",
        checks=(
            Check(
                path=("answer", "allowed_artifact"),
                points=3,
                label="Allowed artifact is a redacted trace or JSON writeup",
                any_of=("redacted", "json", "writeup", "trace id"),
            ),
            Check(
                path=("answer", "forbidden_artifact"),
                points=3,
                label="Forbidden artifact mentions secrets or private data",
                any_of=("secret", "token", "credential", "private data", "pii"),
            ),
            Check(
                path=("evidence",),
                points=4,
                label="Evidence explains why the repo never needs real secrets",
                min_words=22,
                all_of=("no", "secret"),
            ),
        ),
    ),
    MissionRubric(
        mission_id="mission-10",
        title="Capstone AI incident report",
        checks=(
            Check(
                path=("answer", "incident_type"),
                points=2,
                label="Incident type is retrieval context mismatch",
                any_of=("retrieval", "context mismatch", "wrong context"),
            ),
            Check(
                path=("answer", "shap_lesson"),
                points=2,
                label="SHAP lesson references feature contribution",
                any_of=("feature", "contribution", "push"),
            ),
            Check(
                path=("answer", "opik_lesson"),
                points=2,
                label="Opik lesson references traces",
                any_of=("trace", "span", "evaluation"),
            ),
            Check(
                path=("answer", "next_action"),
                points=2,
                label="Next action is concrete",
                any_of=("remove", "retrain", "add test", "monitor", "evaluate"),
            ),
            Check(
                path=("evidence",),
                points=2,
                label="Evidence is a short incident report",
                min_words=35,
            ),
        ),
    ),
)

RUBRIC_BY_ID = {mission.mission_id: mission for mission in RUBRIC}
