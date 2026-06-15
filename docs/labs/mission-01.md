# Mission 01: SHAP vs Opik

## Learning Objective

This mission checks whether you can separate two related ideas:

- explaining a model prediction
- observing an AI application workflow

Many beginners put every AI debugging tool into one mental bucket. That makes
the rest of the workshop confusing. SHAP and Opik both help us understand AI
systems, but they answer different questions.

## Background

SHAP is most useful when you already have a model prediction and want to know
which input features contributed to that output. In the loan-risk example, SHAP
can help explain why one row was predicted as high risk.

Opik is most useful when an AI application has several steps and you want to
inspect what happened inside one request. In the support-bot example, Opik-style
traces can show whether retrieval, prompting, model output, or evaluation failed.

## Mini Lesson

Think about the boundary of the thing you are inspecting.

With SHAP, the boundary is usually one model and one output from that model. The
input is a row of features. The output is a prediction. The explanation says how
the features contributed to that prediction. If the model predicts high risk,
SHAP helps answer why the score moved toward high risk.

With Opik, the boundary is wider. You are not only inspecting the language
model. You are inspecting the application path. A single request might include
retrieval, prompt construction, one or more model calls, tool calls, evaluator
scores, user feedback, latency, and cost. If the final answer is bad, Opik helps
you find which step produced bad evidence.

This distinction matters in real debugging. If retrieval gives the model the
wrong document, the model may produce a bad answer even if it followed the
prompt perfectly. SHAP would not be the right tool for that problem because the
question is not "which tabular feature moved this prediction?" The question is
"which step in the app sent the request in the wrong direction?"

## Read Before Answering

- [SHAP for Humans](../shap-for-humans.md)
- [Opik for Humans](../opik-for-humans.md)

## Guided Thinking

Ask yourself two questions:

1. Am I explaining a prediction made by a model?
2. Am I inspecting the path taken by an LLM, RAG, or agent request?

If the answer is the first one, think SHAP. If the answer is the second one,
think Opik.

## Worked Comparison

Use these two examples to test your understanding:

| Situation | Better tool | Why |
|---|---|---|
| A model predicts that applicant `C-104` is risky | SHAP | We need feature contributions for one model prediction |
| A support bot answers a refund question with Wi-Fi instructions | Opik | We need the trace of retrieval, prompt, and model steps |

Notice the difference in evidence. A SHAP answer should mention features, such
as `late_payments` or `credit_utilization`. An Opik answer should mention trace
steps, such as `retrieval`, `llm_call`, or evaluator scores.

## Common Mistakes

Do not write "SHAP and Opik both explain AI" and stop there. That sentence is
true but too vague.

Do not say "Opik explains model features." In this challenge, Opik is about the
AI app trace. It can show the prompt, retrieved context, response, and scores,
but it is not the feature-contribution tool for the loan-risk model.

Do not say "SHAP traces the app." SHAP explains model output. A trace is the
Opik-side object.

## What A Good Answer Looks Like

A good answer has one sentence for SHAP and one sentence for Opik. Each sentence
should include the object being inspected.

For SHAP, mention `prediction`, `model output`, or `feature contribution`.
For Opik, mention `trace`, `pipeline`, `LLM`, `RAG`, or `agent`.

## Submit

Create:

```text
submissions/AIEX-YOUR-TEAM/mission-01.json
```

Example shape:

```json
{
  "participant_id": "AIEX-YOUR-TEAM",
  "mission_id": "mission-01",
  "answer": {
    "shap_scope": "one model prediction and its feature contributions",
    "opik_scope": "one LLM/RAG/agent pipeline trace"
  },
  "evidence": [
    "SHAP helps when a model prediction is wrong because it shows which features pushed the score up or down.",
    "Opik helps when an AI app answer is wrong because the trace shows retrieval, prompt, tool, and model steps."
  ]
}
```

## Self Check

Can you explain it to a friend in one sentence?

> SHAP explains the prediction; Opik explains the request path.
