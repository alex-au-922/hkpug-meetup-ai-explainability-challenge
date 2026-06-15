# Mission 06: Read An Opik-Style Trace

## Learning Objective

This mission teaches trace reading. You will inspect a support-bot request and
identify which step caused the bad answer.

In Opik-style debugging, the important habit is not "the bot was wrong." The
important habit is "the bot was wrong because this step produced this bad
evidence."

## Artifact

```text
labs/artifacts/support_bot_traces.json
```

Open the `traces` list.

## Background

The bad trace has:

- a user question
- a final answer that does not answer that question
- low evaluator scores
- a span that points to the broken step

The trace gives you a sequence. Read it in order: user input, retrieval, model
call, final answer, scores. If the answer does not match the question, look
backward to find where the mismatch first appeared.

## Mini Lesson

Trace reading is a debugging skill. The mistake many beginners make is jumping
straight to the final answer and blaming the model. Sometimes the model did
produce the wrong words, but the cause may be earlier in the request.

For a RAG app, the retrieval step is especially important. The language model
answers using the context it receives. If retrieval sends irrelevant context,
the final answer can be irrelevant too. That does not mean the answer is okay.
It means the fix might belong in retrieval rather than in the final prompt.

Opik-style traces help because they preserve the path:

1. user input
2. retrieved context
3. model call
4. final answer
5. evaluator scores

Your answer should show that you followed this path rather than guessing.

## Study Note

When debugging a trace, look for the first wrong turn. The final answer is where
the user notices the problem, but it is not always where the problem started.

For a retrieval-augmented support bot, the request path is like a chain. If the
retrieval step is weak, the model call receives weak evidence. If the model call
receives weak evidence, the final answer may sound fluent but still answer the
wrong question. This is why observability tools show spans rather than only the
last message.

The practical question is always: "Where would I fix this?" If retrieval
returned Wi-Fi policy for a refund question, changing the final wording may not
solve the root cause. The team probably needs better retrieval routing, better
indexing, or an evaluation that catches irrelevant context.

## Guided Reading

For each trace, compare:

| Field | Question |
|---|---|
| `user_input` | What did the user ask? |
| retrieval span | What context did the app retrieve? |
| `final_answer` | Did the answer match the question? |
| `scores` | Which metric confirms the failure? |

The failing trace should have both a bad answer and low scores.

## Worked Reading

In the artifact, one trace has this pattern:

```text
user asks: typhoon refund question
retrieval returns: venue Wi-Fi policy
final answer: Wi-Fi password instructions
context_relevance: very low
```

That is enough to diagnose the failure. The first mismatch happens at retrieval:
the app looked up the wrong topic. The model then answered using that wrong
context.

## Common Mistakes

Do not answer only with the final answer text. The mission asks for the failing
trace ID, the bad step, and the failed metric.

Do not say the bad step is "the whole AI." That is too vague to fix.

Do not ignore evaluator scores. A trace diagnosis is stronger when the scores
support your reading.

## What A Good Answer Looks Like

A good answer names `trace-003`, identifies `retrieval` as the bad step, and
uses `context_relevance` as the failed metric. The evidence should say that the
model got irrelevant or wrong context before answering.

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
