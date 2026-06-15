# Mission 05: Write A Model Incident Note

## Goal

Turn the SHAP findings into a small incident note.

## Artifact

```text
labs/artifacts/loan_risk_casebook.json
```

Use case `C-104` and the `known_trap` section.

## What To Notice

A useful incident note has four parts:

| Part | Question |
|---|---|
| Symptom | What went wrong? |
| Evidence | What did we see? |
| Root cause | Why might it have happened? |
| Fix | What should we change? |

## Submit

```json
{
  "participant_id": "AIEX-YOUR-TEAM",
  "mission_id": "mission-05",
  "answer": {
    "symptom": "short plain-English symptom",
    "root_cause": "short root cause",
    "fix": "short fix"
  },
  "evidence": [
    "Use exact feature names and case IDs from the artifact so a reviewer can follow your reasoning."
  ]
}
```

## Self Check

If an organizer read only your note, would they know what to fix next?
