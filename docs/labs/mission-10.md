# Mission 10: Capstone AI Incident Report

## Learning Objective

This capstone checks whether you can combine both halves of the tutorial. You
should be able to talk about SHAP without confusing it with Opik, and talk about
Opik without pretending it explains feature contributions.

The final answer should read like a small incident report. A teammate should be
able to read it and understand what happened, what evidence supports your
diagnosis, and what the next action should be.

## Artifacts

```text
labs/artifacts/loan_risk_casebook.json
labs/artifacts/support_bot_traces.json
```

## Background

The two tools answer different debugging questions:

- SHAP: which features moved the model score?
- Opik: which step in the AI app produced bad behavior?

Your capstone should not pretend they are the same thing.

The capstone does not require a long essay. It requires clear separation:

| Part | Include |
|---|---|
| Incident type | A short category such as retrieval context mismatch |
| SHAP lesson | One sentence about feature contribution |
| Opik lesson | One sentence about traces or evaluation |
| Next action | One concrete thing the team should do |
| Evidence | A short paragraph tying the artifacts together |

## Guided Writing

Use exact names from the artifacts. Mention at least one SHAP feature, such as
`late_payments` or `credit_utilization`, and at least one trace, such as
`trace-003`. The report should make it obvious that you read the artifacts
rather than guessing from the mission title.

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
