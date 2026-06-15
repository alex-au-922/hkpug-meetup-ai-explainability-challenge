# Mission 06: Read An Opik-Style Trace

## Goal

Find the bad support-bot trace and identify the broken step.

## Artifact

```text
labs/artifacts/support_bot_traces.json
```

Open the `traces` list.

## What To Notice

The bad trace has:

- a user question
- a final answer that does not answer that question
- low evaluator scores
- a span that points to the broken step

## Submit

```json
{
  "participant_id": "AIEX-YOUR-TEAM",
  "mission_id": "mission-06",
  "answer": {
    "failing_trace_id": "trace-id-here",
    "bad_step": "step-name-here",
    "failed_metric": "metric-name-here"
  },
  "evidence": [
    "The trace failed because the model got the wrong context before answering."
  ]
}
```

## Beginner Translation

The bot did not become evil. It read the wrong notes.
