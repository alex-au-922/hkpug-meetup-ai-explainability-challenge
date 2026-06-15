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

## Guided Reading

For each trace, compare:

| Field | Question |
|---|---|
| `user_input` | What did the user ask? |
| retrieval span | What context did the app retrieve? |
| `final_answer` | Did the answer match the question? |
| `scores` | Which metric confirms the failure? |

The failing trace should have both a bad answer and low scores.

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
