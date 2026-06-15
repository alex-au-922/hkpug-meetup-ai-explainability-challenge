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

## Read Before Answering

- [SHAP for Humans](../shap-for-humans.md)
- [Opik for Humans](../opik-for-humans.md)

## Guided Thinking

Ask yourself two questions:

1. Am I explaining a prediction made by a model?
2. Am I inspecting the path taken by an LLM, RAG, or agent request?

If the answer is the first one, think SHAP. If the answer is the second one,
think Opik.

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
