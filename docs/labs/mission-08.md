# Mission 08: Quantify Before/After Trace Improvement

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

## Mini Lesson

Before-and-after comparison is one of the safest ways to talk about AI
improvement. Without comparison, people often rely on vibes. They read a new
answer, decide it sounds better, and move on. That is risky because the system
may have improved one case while damaging another.

In this mission, you only compare one case. That is not a complete evaluation
program, but it teaches the basic habit:

1. Keep the input stable.
2. Identify what changed.
3. Compare the relevant scores.
4. Explain the result in plain English.

The stable input is the typhoon refund question. The changed component is the
retrieval route. The score movement tells you whether the retrieved context
became more relevant.

## Study Note

Before-and-after evidence is stronger when the comparison is controlled. In a
controlled comparison, you keep the user question the same and change one
meaningful part of the system. Then you can talk about the result without
mixing many causes together.

Here, the user question stays the same. The important change is the retrieval
behavior. That makes the score movement easier to interpret: the system moved
from irrelevant context to event-policy context, so `context_relevance` rose.

This is also why one passing trace is not the same as a full launch approval.
The mission teaches the shape of the evidence, not the claim that every support
bot case is fixed. A careful engineer would add more dataset items before
declaring the whole app healthy.

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

## Worked Reading

For `trace-003`, retrieval returned general venue documents, including Wi-Fi
policy. For `trace-004`, retrieval returned weather policy, cancellation notice
policy, and refund handling notes.

That is the actual system change. The model was no longer asked to answer a
refund question using Wi-Fi context.

The metric movement is also clear:

```text
context_relevance: 0.22 -> 0.91
```

That number does not prove the entire app is perfect. It does show that this
specific failure improved.

## Common Mistakes

Do not compare two different user questions. A useful before-and-after
comparison should keep the input stable.

Do not write "the answer is better" without naming the changed component.

Do not ignore the score. The score is the evidence that supports the comparison.

## Scored Questions

A complete comparison does five things:

1. Names the before trace and after trace.
2. Identifies the component that changed.
3. Calculates the context relevance delta.
4. Calculates the answer correctness delta.
5. Explains why the comparison is fair because the user question stayed the same.

## Submit

```json
{
  "participant_id": "AIEX-YOUR-TEAM",
  "mission_id": "mission-08",
  "answer": {
    "before_trace_id": "trace-id-here",
    "after_trace_id": "trace-id-here",
    "changed_component": "component-name-here",
    "context_relevance_delta": "after minus before",
    "answer_correctness_delta": "after minus before"
  },
  "evidence": [
    "Compare the same question across both traces and cite the score movement."
  ]
}
```

## Beginner Translation

Before and after is not a feeling. It is a comparison.
