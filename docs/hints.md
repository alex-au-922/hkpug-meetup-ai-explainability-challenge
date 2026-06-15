# Hints

Use hints only when you are stuck. They are arranged from gentle to direct.

## Mission 01

Gentle: Ask "am I explaining a prediction or a request path?"

Direct: SHAP belongs to model predictions. Opik belongs to traces for LLM, RAG,
and agent apps.

## Mission 02

Gentle: Look for the largest `mean_abs_shap` values.

Direct: The top two values are `late_payments` and `credit_utilization`.

## Mission 03

Gentle: Positive SHAP values push risk up. Negative values push risk down.

Direct: In `C-104`, `late_payments` and `credit_utilization` push up. Stable
income and employment history push down.

## Mission 04

Gentle: Ask whether the feature is known before the decision.

Direct: `post_approval_call_count` is data leakage because it exists after the
approval process.

## Mission 05

Gentle: Write it like an incident note, not a school essay.

Direct: Symptom, root cause, fix, and evidence are enough.

## Mission 06

Gentle: Look for the lowest scores.

Direct: `trace-003` fails because retrieval returned venue Wi-Fi context for a
weather refund question.

## Mission 07

Gentle: A trace can become a regression test.

Direct: Use `weather-refund-policy` and watch `context_relevance` or
`answer_correctness`.

## Mission 08

Gentle: Compare both the trace text and the scores.

Direct: `trace-003` is before. `trace-004` is after. The retrieval route changed.

## Mission 09

Gentle: Public repo means public evidence.

Direct: Redacted trace IDs and JSON writeups are fine. Secrets, tokens,
credentials, and private data are not.

## Mission 10

Gentle: Do not blend SHAP and Opik into one vague "AI explainability" blob.

Direct: Build a cross-artifact report. Use `C-104`, `late_payments`,
`credit_utilization`, `stable_income`, `post_approval_call_count`, `trace-003`,
`trace-004`, `context_relevance`, and `weather-refund-policy`.
