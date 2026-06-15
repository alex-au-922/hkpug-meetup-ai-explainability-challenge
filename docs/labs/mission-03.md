# Mission 03: Explain One Wrong Prediction

## Goal

Explain why case `C-104` was predicted as risky even though the real label says
the person paid on time.

## Artifact

```text
labs/artifacts/loan_risk_casebook.json
```

Open:

```text
local_cases -> case_id C-104
```

## What To Notice

For this challenge:

- positive SHAP values push risk up
- negative SHAP values push risk down

Do not just list every field. Say which forces won.

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
