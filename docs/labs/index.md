# Missions

The missions are the practice section of this textbook. Each one asks you to
apply a concept from the SHAP or Opik chapters to a small artifact.

The missions are intentionally narrow. A beginner should not need to search the
web for every term. The point is to build a reliable reading habit:

1. Identify the question being asked.
2. Find the relevant artifact section.
3. Make one claim.
4. Support the claim with evidence.
5. Submit the answer in a predictable JSON format.

## The Artifacts

The artifacts live in:

```text
labs/artifacts/loan_risk_casebook.json
labs/artifacts/support_bot_traces.json
```

The first artifact teaches SHAP-style thinking. The second artifact teaches
Opik-style thinking.

| Artifact | Use it when the mission asks about |
|---|---|
| `loan_risk_casebook.json` | model predictions, feature contributions, global SHAP, local SHAP, data leakage |
| `support_bot_traces.json` | traces, retrieval failures, evaluator scores, datasets, safe evidence |

## Mission List

| Mission | Topic | What you practice |
|---|---|---|
| 01 | Tool triage | Assigning three debugging jobs to the right evidence workflow |
| 02 | Global SHAP ranking | Ranking features, calculating a margin, and flagging review risk |
| 03 | Local SHAP force balance | Calculating the push-pull movement for one wrong prediction |
| 04 | Leakage audit | Rejecting a future-data feature and proposing mitigation |
| 05 | Model incident note | Turning local SHAP and leakage evidence into an action plan |
| 06 | Opik trace diagnosis | Finding the first bad span and citing failed evaluator scores |
| 07 | Evaluation gate | Turning a failed trace into a regression gate with thresholds |
| 08 | Before/after traces | Quantifying improvement with trace IDs and score deltas |
| 09 | Safe evidence bundle | Submitting useful public evidence without leaking secrets |
| 10 | Capstone evidence synthesis | Combining SHAP, Opik, safety, and action planning |

## How To Write A Good Answer

A weak answer says:

> The model used late payments.

A stronger answer says:

> In case `C-104`, `late_payments` has a positive SHAP value, so it pushed the
> risk score upward. `stable_income` has a negative SHAP value, so it pushed the
> score downward. The upward contributions were larger, so the model predicted
> higher risk.

The second answer is better because it explains direction, evidence, and
conclusion.

For Opik missions, a weak answer says:

> The bot was wrong.

A stronger answer says:

> `trace-003` failed at retrieval. The user asked about typhoon refunds, but the
> retriever returned Wi-Fi policy context. The low `context_relevance` score
> supports the diagnosis.

Again, the stronger answer names the broken step and cites evidence.

## Submission Tip

Use your own words. The scorer checks for evidence, but the real point is that
another human can understand your reasoning. If your answer would not help a
teammate debug the system, add one more sentence explaining why the evidence
matters.

Mission 10 is deliberately stricter than the earlier missions. It asks you to
combine both artifact files, compare before and after traces, name the leakage
trap, and write a concrete next-action plan.
