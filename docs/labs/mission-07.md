# Mission 07: Turn A Failure Into An Evaluation

## Goal

Use the bad trace as a repeatable test case.

## Artifact

```text
labs/artifacts/support_bot_traces.json
```

Use the failing trace from Mission 06.

## What To Notice

One bad trace is a bug report. A dataset item is how you make sure the bug does
not come back.

In Opik-style workflows, you can keep examples and evaluate future changes
against them.

## Submit

```json
{
  "participant_id": "AIEX-YOUR-TEAM",
  "mission_id": "mission-07",
  "answer": {
    "dataset_item": "item-name-here",
    "metric_to_watch": "metric-name-here",
    "regression_rule": "what should happen if the score drops?"
  },
  "evidence": [
    "The trace becomes a repeatable test because ..."
  ]
}
```

## Self Check

Could this test catch the same failure next week?
