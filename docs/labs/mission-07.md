# Mission 07: Turn A Failure Into An Evaluation

## Learning Objective

This mission teaches the difference between noticing a failure and preventing a
regression. A trace explains what went wrong once. An evaluation dataset helps
you check whether the same thing goes wrong again.

## Artifact

```text
labs/artifacts/support_bot_traces.json
```

Use the failing trace from Mission 06.

## Background

One bad trace is a bug report. A dataset item is how you make sure the bug does
not come back.

In Opik-style workflows, you can keep examples and evaluate future changes
against them.

The workflow is simple:

1. Save the user question.
2. Save the expected behavior.
3. Choose a metric that should improve.
4. Run the same case after each change.

This is how an AI debugging story becomes an engineering feedback loop.

## Guided Reading

Look at the failing trace from Mission 06. Find the `dataset_item` field. Then
look at the scores and choose a metric that would catch the same failure next
time.

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
