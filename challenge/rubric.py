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
        title="Triage SHAP vs Opik debugging jobs",
        checks=(
            Check(
                path=("answer", "triage", "loan_case_debug"),
                points=2,
                label="Loan case debugging is assigned to SHAP",
                any_of=("shap",),
            ),
            Check(
                path=("answer", "triage", "support_bot_wrong_answer"),
                points=2,
                label="Support bot request debugging is assigned to Opik",
                any_of=("opik",),
            ),
            Check(
                path=("answer", "triage", "leakage_feature_audit"),
                points=2,
                label="Feature leakage audit is assigned to SHAP/model review",
                any_of=("shap", "model review", "feature audit"),
            ),
            Check(
                path=("answer", "shared_failure_mode"),
                points=2,
                label="Shared failure mode is evidence mismatch, not tool names",
                all_of=("wrong", "evidence"),
            ),
            Check(
                path=("evidence",),
                points=2,
                label="Evidence distinguishes prediction evidence from trace evidence",
                min_words=35,
                all_of=("prediction", "trace"),
            ),
        ),
    ),
    MissionRubric(
        mission_id="mission-02",
        title="Rank global SHAP and flag review risk",
        checks=(
            Check(
                path=("answer", "top_three_features"),
                points=3,
                label="Top three global features are ranked",
                all_of=("late_payments", "credit_utilization", "stable_income"),
            ),
            Check(
                path=("answer", "top_feature_margin"),
                points=2,
                label="Top feature margin is calculated as 0.07",
                any_of=("0.07",),
            ),
            Check(
                path=("answer", "review_risk_feature"),
                points=2,
                label="Review risk feature is post_approval_call_count",
                any_of=("post_approval_call_count", "post approval call count"),
            ),
            Check(
                path=("evidence",),
                points=3,
                label="Evidence uses values rather than only names",
                min_words=30,
                all_of=("mean_abs_shap", "0.31", "0.24"),
            ),
        ),
    ),
    MissionRubric(
        mission_id="mission-03",
        title="Compute the local SHAP force balance",
        checks=(
            Check(
                path=("answer", "case_id"),
                points=1,
                label="Case C-104 is selected",
                any_of=("c-104",),
            ),
            Check(
                path=("answer", "strongest_positive_feature"),
                points=2,
                label="Strongest positive feature is late_payments",
                any_of=("late_payments", "late payments"),
            ),
            Check(
                path=("answer", "strongest_negative_feature"),
                points=2,
                label="Strongest negative feature is stable_income",
                any_of=("stable_income", "stable income"),
            ),
            Check(
                path=("answer", "net_shap_delta"),
                points=2,
                label="Net SHAP delta is 0.27",
                any_of=("0.27",),
            ),
            Check(
                path=("answer", "error_type"),
                points=1,
                label="Error type recognizes false positive / paid on time mismatch",
                any_of=("false positive", "paid_on_time", "paid on time"),
            ),
            Check(
                path=("evidence",),
                points=2,
                label="Evidence ties base score to prediction score",
                min_words=35,
                all_of=("0.32", "0.59", "late_payments", "stable_income"),
            ),
        ),
    ),
    MissionRubric(
        mission_id="mission-04",
        title="Audit a feature for decision-time leakage",
        checks=(
            Check(
                path=("answer", "rejected_feature"),
                points=2,
                label="Rejected feature is post_approval_call_count",
                any_of=("post_approval_call_count", "post approval call count"),
            ),
            Check(
                path=("answer", "trap_type"),
                points=2,
                label="Trap is data leakage",
                any_of=("leakage", "leaks", "future data"),
            ),
            Check(
                path=("answer", "availability_test"),
                points=2,
                label="Availability test checks after-decision timing",
                all_of=("after", "decision"),
            ),
            Check(
                path=("answer", "safe_comparison_feature"),
                points=1,
                label="Safe comparison feature is available before decision",
                any_of=("employment_months", "stable_income", "late_payments"),
            ),
            Check(
                path=("answer", "mitigation"),
                points=2,
                label="Mitigation removes, retrains, and audits",
                all_of=("remove", "retrain", "audit"),
            ),
            Check(
                path=("evidence",),
                points=1,
                label="Evidence explains the future-data problem",
                min_words=25,
                all_of=("future", "approval"),
            ),
        ),
    ),
    MissionRubric(
        mission_id="mission-05",
        title="Write a model incident note from local and audit evidence",
        checks=(
            Check(
                path=("answer", "affected_case"),
                points=1,
                label="Affected case is C-104",
                any_of=("c-104",),
            ),
            Check(
                path=("answer", "incident_class"),
                points=2,
                label="Incident class recognizes false positive / over-predicted risk",
                any_of=("false positive", "over-predicted", "paid_on_time"),
            ),
            Check(
                path=("answer", "local_drivers"),
                points=2,
                label="Local drivers include up and down forces",
                all_of=("late_payments", "credit_utilization", "stable_income"),
            ),
            Check(
                path=("answer", "systemic_risk"),
                points=2,
                label="Systemic risk names leakage feature",
                any_of=("post_approval_call_count", "leakage"),
            ),
            Check(
                path=("answer", "fix_plan"),
                points=2,
                label="Fix plan removes leakage, audits, and retrains",
                all_of=("remove", "audit", "retrain"),
            ),
            Check(
                path=("evidence",),
                points=1,
                label="Evidence names both local case and leakage feature",
                min_words=35,
                all_of=("c-104", "post_approval_call_count"),
            ),
        ),
    ),
    MissionRubric(
        mission_id="mission-06",
        title="Diagnose the first bad span in a trace",
        checks=(
            Check(
                path=("answer", "failing_trace_id"),
                points=2,
                label="Failing trace is trace-003",
                any_of=("trace-003",),
            ),
            Check(
                path=("answer", "user_intent"),
                points=2,
                label="User intent is typhoon refund",
                all_of=("typhoon", "refund"),
            ),
            Check(
                path=("answer", "first_bad_span"),
                points=2,
                label="First bad span is retrieval",
                any_of=("retrieval", "retriever"),
            ),
            Check(
                path=("answer", "bad_context"),
                points=2,
                label="Bad context is venue Wi-Fi context",
                any_of=("wifi", "wi-fi"),
                all_of=("venue",),
            ),
            Check(
                path=("answer", "failed_scores"),
                points=2,
                label="Failed scores include both low metrics",
                all_of=("context_relevance", "0.22", "answer_correctness", "0.08"),
            ),
        ),
    ),
    MissionRubric(
        mission_id="mission-07",
        title="Design a regression evaluation gate",
        checks=(
            Check(
                path=("answer", "dataset_item"),
                points=2,
                label="Dataset item is weather-refund-policy",
                any_of=("weather-refund-policy", "weather refund policy"),
            ),
            Check(
                path=("answer", "saved_input"),
                points=2,
                label="Saved input preserves typhoon refund question",
                all_of=("typhoon", "refund"),
            ),
            Check(
                path=("answer", "expected_context"),
                points=2,
                label="Expected context is weather/refund policy material",
                any_of=("weather policy", "refund handling", "cancellation notice"),
            ),
            Check(
                path=("answer", "quality_gate"),
                points=2,
                label="Quality gate sets thresholds for both metrics",
                all_of=("context_relevance", "0.85", "answer_correctness", "0.80"),
            ),
            Check(
                path=("answer", "regression_action"),
                points=2,
                label="Regression action blocks, fails, or alerts",
                any_of=("fail", "block", "alert", "regression"),
            ),
        ),
    ),
    MissionRubric(
        mission_id="mission-08",
        title="Quantify before/after trace improvement",
        checks=(
            Check(
                path=("answer",),
                points=2,
                label="Before and after traces are identified",
                all_of=("trace-003", "trace-004"),
            ),
            Check(
                path=("answer", "changed_component"),
                points=2,
                label="Changed component is retrieval routed to event policy",
                all_of=("retrieval", "event-policy"),
            ),
            Check(
                path=("answer", "context_relevance_delta"),
                points=2,
                label="Context relevance delta is 0.69",
                any_of=("0.69",),
            ),
            Check(
                path=("answer", "answer_correctness_delta"),
                points=2,
                label="Answer correctness delta is 0.78",
                any_of=("0.78",),
            ),
            Check(
                path=("evidence",),
                points=2,
                label="Evidence controls for same question",
                min_words=35,
                all_of=("same question", "trace-003", "trace-004"),
            ),
        ),
    ),
    MissionRubric(
        mission_id="mission-09",
        title="Build a safe public evidence bundle",
        checks=(
            Check(
                path=("answer", "safe_bundle"),
                points=3,
                label="Safe bundle uses redacted IDs, scores, and diagnosis",
                all_of=("redacted", "trace", "scores", "diagnosis"),
            ),
            Check(
                path=("answer", "forbidden_bundle"),
                points=3,
                label="Forbidden bundle rejects secrets and private data",
                all_of=("api keys", "access tokens", "credentials", "personal data"),
            ),
            Check(
                path=("answer", "redaction_rule"),
                points=2,
                label="Redaction rule says public repo needs no secrets",
                all_of=("public", "no", "secret"),
            ),
            Check(
                path=("evidence",),
                points=2,
                label="Evidence explains toy/public boundary",
                min_words=35,
                all_of=("toy", "public"),
            ),
        ),
    ),
    MissionRubric(
        mission_id="mission-10",
        title="Capstone evidence synthesis",
        checks=(
            Check(
                path=("answer", "incident_type"),
                points=1,
                label="Incident type is retrieval context mismatch",
                any_of=("retrieval", "context mismatch", "wrong context"),
            ),
            Check(
                path=("answer", "shap_case_id"),
                points=1,
                label="SHAP case is C-104",
                any_of=("c-104",),
            ),
            Check(
                path=("answer",),
                points=1,
                label="SHAP force summary names risk-up and risk-down features",
                all_of=("late_payments", "credit_utilization", "stable_income"),
            ),
            Check(
                path=("answer", "leakage_feature"),
                points=1,
                label="Leakage feature is identified",
                any_of=("post_approval_call_count", "post approval call count"),
            ),
            Check(
                path=("answer",),
                points=1,
                label="Trace comparison names failure, fix, and retrieval",
                all_of=("trace-003", "trace-004", "retrieval"),
            ),
            Check(
                path=("answer", "metric_shift"),
                points=1,
                label="Metric shift names context relevance 0.22 to 0.91",
                all_of=("context_relevance", "0.22", "0.91"),
            ),
            Check(
                path=("answer", "regression_dataset_item"),
                points=1,
                label="Regression dataset item is weather-refund-policy",
                any_of=("weather-refund-policy", "weather refund policy"),
            ),
            Check(
                path=("answer", "safe_evidence_boundary"),
                points=1,
                label="Safe evidence boundary rejects secrets",
                all_of=("redacted", "secret"),
            ),
            Check(
                path=("answer", "next_action"),
                points=1,
                label="Next action is concrete",
                any_of=(
                    "remove",
                    "retrain",
                    "audit",
                    "add test",
                    "monitor",
                    "evaluate",
                ),
            ),
            Check(
                path=("evidence",),
                points=1,
                label="Evidence is a complete cross-artifact incident report",
                min_words=100,
                all_of=("c-104", "trace-003", "trace-004", "post_approval_call_count"),
            ),
        ),
    ),
)

RUBRIC_BY_ID = {mission.mission_id: mission for mission in RUBRIC}
