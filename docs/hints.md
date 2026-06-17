# Hints

Use hints only when you are stuck. They are arranged from gentle to direct.

## Mission 01

Gentle: Do not answer with only two tool names. Classify all three debugging
jobs and explain what kind of evidence each job needs.

Direct: The loan case is a prediction problem, the support-bot failure is a
trace problem, and the leakage audit is a feature-review problem.

## Mission 02

Gentle: Rank the `mean_abs_shap` values, then calculate the gap between first
and second place.

Direct: Your answer needs the top three features, the first-minus-second margin,
and the suspicious feature that deserves review.

## Mission 03

Gentle: Positive SHAP values push risk up. Negative values push risk down. The
net movement is the predicted probability minus the base probability.

Direct: Name the strongest positive feature, the strongest negative feature,
the net SHAP movement, and the error type for `C-104`.

## Mission 04

Gentle: Ask whether the feature is known before the decision, and compare it
with a feature that is available at decision time.

Direct: Your answer needs the rejected feature, trap type, availability test,
safe comparison feature, and mitigation plan.

## Mission 05

Gentle: Write it like an incident note, not a school essay.

Direct: Include affected case, incident class, local drivers, systemic risk, and
a fix plan that can actually be implemented.

## Mission 06

Gentle: Look for the first wrong span, not just the final bad answer.

Direct: Your answer needs the failing trace, user intent, first bad span, bad
context, and both failed scores.

## Mission 07

Gentle: A trace can become a regression test only when you save the input,
expected context, score thresholds, and action.

Direct: Use a gate that watches both `context_relevance` and
`answer_correctness`, then say whether the build should fail, block, or alert.

## Mission 08

Gentle: Compare both the trace text and the scores.

Direct: Compute the two score deltas and explain why the comparison is fair.

## Mission 09

Gentle: Public repo means public evidence. Give a bundle rule, not just one
example.

Direct: Your safe bundle should mention redacted trace IDs, scores, and
diagnosis. Your forbidden bundle should reject secrets, tokens, credentials,
and personal data.

## Mission 10

Gentle: Do not blend SHAP and Opik into one vague "AI explainability" blob.

Direct: Build a cross-artifact report. Use `C-104`, `late_payments`,
`credit_utilization`, `stable_income`, `post_approval_call_count`, `trace-003`,
`trace-004`, `context_relevance`, and `weather-refund-policy`.
