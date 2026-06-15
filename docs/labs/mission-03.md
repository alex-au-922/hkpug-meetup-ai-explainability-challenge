# Mission 03: Explain One Wrong Prediction

## Learning Objective

This mission teaches local explanation. Instead of asking which features matter
on average, you explain one specific prediction.

The case is intentionally interesting: the model predicted risk, but the actual
label says the person paid on time. Your job is not to defend the model. Your
job is to explain why the model behaved that way.

## Artifact

```text
labs/artifacts/loan_risk_casebook.json
```

Open:

```text
local_cases -> case_id C-104
```

## Background

For this challenge:

- positive SHAP values push risk up
- negative SHAP values push risk down

Do not just list every field. Say which forces won.

The phrase "forces won" is useful because local SHAP is a push-and-pull story.
Some features push the score upward. Other features pull it downward. The final
prediction depends on the combined movement.

## Guided Reading

Inside case `C-104`, find the `shap_values` list. For each feature, read:

- the feature name
- the SHAP value
- the direction label

Then group the features into two buckets:

| Bucket | Meaning |
|---|---|
| `pushes_risk_up` | Features that made the model more worried |
| `pushes_risk_down` | Features that made the model less worried |

Your explanation should mention both buckets.

## Submit

```json
{
  "participant_id": "AIEX-YOUR-TEAM",
  "mission_id": "mission-03",
  "answer": {
    "case_id": "C-104",
    "pushes_risk_up": ["feature_a", "feature_b"],
    "pushes_risk_down": ["feature_c"]
  },
  "evidence": [
    "The prediction was pushed up by ... and pushed down by ...",
    "The risk-up values were larger than the risk-down values, so the model crossed the risk threshold."
  ]
}
```

## Self Check

Could a non-ML person understand why the model got nervous?
