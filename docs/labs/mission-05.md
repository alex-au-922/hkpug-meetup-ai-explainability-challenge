# Mission 05: Write A Model Incident Note

## Learning Objective

This mission teaches you to turn model evidence into an engineering note. A
useful explanation should lead to a next action. Otherwise, it is just a nice
chart.

## Artifact

```text
labs/artifacts/loan_risk_casebook.json
```

Use case `C-104` and the `known_trap` section.

## Background

A useful incident note has four parts:

| Part | Question |
|---|---|
| Symptom | What went wrong? |
| Evidence | What did we see? |
| Root cause | Why might it have happened? |
| Fix | What should we change? |

In real teams, this style of note is valuable because it is short enough for a
busy maintainer to read but specific enough to act on. You do not need to write
a long essay. You do need to name the evidence.

## Guided Writing

Use this structure:

1. Symptom: describe the bad or surprising behavior.
2. Root cause: explain the likely reason using SHAP evidence or leakage evidence.
3. Fix: propose a concrete change.
4. Evidence: mention exact case IDs and feature names.

Avoid vague phrases like "the AI was wrong." Say what was wrong and why.

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
