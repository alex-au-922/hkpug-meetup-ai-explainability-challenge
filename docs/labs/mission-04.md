# Mission 04: Spot A SHAP Trap

## Learning Objective

This mission teaches a critical warning: explanation is not the same thing as
approval. SHAP can show that a feature influenced the model, but humans still
need to decide whether that feature is valid and safe to use.

## Artifact

```text
labs/artifacts/loan_risk_casebook.json
```

Open:

```text
known_trap
```

## Background

SHAP can reveal that a feature matters. It cannot bless the feature as fair,
legal, causal, or available.

If a model uses a feature that only exists after the decision, it is probably
peeking into the future.

This is called data leakage. Data leakage often makes a model look better during
testing than it will be in real life. The model is effectively using information
that would not exist when the prediction is supposed to happen.

## Guided Reading

Open the `known_trap` section. Read the feature name, the trap type, and the
explanation of why the feature is bad. Your answer should connect the timing
problem to the phrase "data leakage" or "future data."

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
