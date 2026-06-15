# Mission 10: Capstone AI Incident Report

## Goal

Write a short incident report that combines the SHAP and Opik lessons.

## Artifacts

```text
labs/artifacts/loan_risk_casebook.json
labs/artifacts/support_bot_traces.json
```

## What To Notice

The two tools answer different debugging questions:

- SHAP: which features moved the model score?
- Opik: which step in the AI app produced bad behavior?

Your capstone should not pretend they are the same thing.

## Submit

```json
{
  "participant_id": "AIEX-YOUR-TEAM",
  "mission_id": "mission-10",
  "answer": {
    "incident_type": "short category",
    "shap_lesson": "what SHAP taught you",
    "opik_lesson": "what Opik taught you",
    "next_action": "one concrete next action"
  },
  "evidence": [
    "Write a short incident report. Mention at least one SHAP feature and one Opik trace."
  ]
}
```

## Self Check

Could another team reproduce your reasoning from the artifacts alone?
