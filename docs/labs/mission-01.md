# Mission 01: SHAP vs Opik

## Goal

Explain the difference between SHAP and Opik without sounding like a vendor
page.

## Read

- [SHAP for Humans](../shap-for-humans.md)
- [Opik for Humans](../opik-for-humans.md)

## What To Notice

SHAP is about a model prediction. Opik is about an AI app trace.

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
