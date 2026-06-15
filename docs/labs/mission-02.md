# Mission 02: Read A Global SHAP Summary

## Learning Objective

This mission teaches you to read global feature importance. The word "global"
means you are looking across many examples, not explaining just one row.

By the end of this mission, you should be able to open a SHAP-style summary and
identify which features usually move the model output the most.

## Artifact

```text
labs/artifacts/loan_risk_casebook.json
```

Open the `global_summary` section.

## Background

`mean_abs_shap` means average strength. The sign is ignored because this summary
only asks "how much does this feature usually move the score?"

The largest value is the top global feature.

This is different from a local explanation. A global summary is useful for
understanding the model's general behavior, but it does not explain every single
prediction. Treat it like a map of the model's usual habits.

## Guided Reading

Open the `global_summary` list. Each item has:

- a feature name
- a `mean_abs_shap` value
- a plain-English note

Sort the values in your head from largest to smallest. The two largest values
are the answer.

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
