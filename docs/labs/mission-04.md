# Mission 04: Spot A SHAP Trap

## Goal

Find the suspicious feature that should not be used at decision time.

## Artifact

```text
labs/artifacts/loan_risk_casebook.json
```

Open:

```text
known_trap
```

## What To Notice

SHAP can reveal that a feature matters. It cannot bless the feature as fair,
legal, causal, or available.

If a model uses a feature that only exists after the decision, it is probably
peeking into the future.

## Submit

```json
{
  "participant_id": "AIEX-YOUR-TEAM",
  "mission_id": "mission-04",
  "answer": {
    "suspicious_feature": "feature_name_here",
    "trap_type": "trap_name_here"
  },
  "evidence": [
    "This feature is suspicious because it is known after the decision, not before it."
  ]
}
```

## Beginner Translation

If you only know the fact after the answer, the model was cheating.
