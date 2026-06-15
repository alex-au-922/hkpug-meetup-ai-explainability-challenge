# Mission 08: Compare Before And After Traces

## Learning Objective

This mission teaches evidence-based comparison. In AI work, it is easy to say a
change "feels better." This mission asks you to prove improvement with a before
trace, an after trace, and a score movement.

## Artifact

```text
labs/artifacts/support_bot_traces.json
```

Compare:

```text
trace-003
trace-004
```

## Background

Do not say "it got better" without evidence. Use the changed component and the
score movement.

For this artifact, the interesting comparison is `trace-003` versus
`trace-004`. The user question is the same, but the retrieval behavior changes.
That lets you compare the system before and after a fix.

## Guided Reading

Read the two traces side by side:

| Compare | Before | After |
|---|---|---|
| Trace ID | `trace-003` | `trace-004` |
| Retrieval topic | Wrong context | Event-policy context |
| Context relevance | Low | High |
| Final answer | Wrong topic | Related to weather policy |

Your answer should name both trace IDs, the changed component, and the metric
improvement.

## Submit

```json
{
  "participant_id": "AIEX-YOUR-TEAM",
  "mission_id": "mission-08",
  "answer": {
    "before_trace_id": "trace-id-here",
    "after_trace_id": "trace-id-here",
    "changed_component": "component-name-here"
  },
  "evidence": [
    "The context relevance score improved from ... to ... after ..."
  ]
}
```

## Beginner Translation

Before and after is not a feeling. It is a comparison.
