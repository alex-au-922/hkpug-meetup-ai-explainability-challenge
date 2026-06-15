# Mission 02: Read A Global SHAP Summary

## Goal

Find the features that matter most across the toy loan-risk model.

## Artifact

```text
labs/artifacts/loan_risk_casebook.json
```

Open the `global_summary` section.

## What To Notice

`mean_abs_shap` means average strength. The sign is ignored because this summary
only asks "how much does this feature usually move the score?"

The largest value is the top global feature.

## Submit

```json
{
  "participant_id": "AIEX-YOUR-TEAM",
  "mission_id": "mission-02",
  "answer": {
    "top_global_feature": "feature_name_here",
    "second_global_feature": "feature_name_here"
  },
  "evidence": [
    "The largest mean absolute SHAP value belongs to ...",
    "The next largest bar/value belongs to ..."
  ]
}
```

## Beginner Translation

If global SHAP were a bar chart, this mission asks which two bars are tallest.
