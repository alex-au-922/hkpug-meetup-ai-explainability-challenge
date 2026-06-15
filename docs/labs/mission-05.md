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

## Mini Lesson

An incident note is not the same as a model explanation. A model explanation
tells you what happened inside the prediction. An incident note turns that
evidence into an operational decision.

For this mission, imagine you are writing to the person who owns the model. They
need to understand:

- what failed
- why it probably failed
- what evidence supports your claim
- what action should happen next

This is the bridge from explainability to engineering. A SHAP chart by itself
does not improve the system. A clear note can lead to feature removal, retraining,
new tests, or human review.

## Study Note

Think of this mission as writing the paragraph that would go into an issue
tracker. The reader should not need to know SHAP deeply. They should still be
able to understand the situation and take action.

That means your note should translate technical evidence into operational
language. "The SHAP value was 0.24" is evidence, but it is not yet an incident
note. "Late payments and credit utilization pushed case C-104 toward a risky
prediction even though the actual label was paid on time" is much clearer.

The fix should also be testable. "Improve the model" is not testable. "Remove
the post-approval feature, retrain, and compare errors on paid-on-time cases" is
testable. A good incident note leaves the next engineer with a concrete path.

## Guided Writing

Use this structure:

1. Symptom: describe the bad or surprising behavior.
2. Root cause: explain the likely reason using SHAP evidence or leakage evidence.
3. Fix: propose a concrete change.
4. Evidence: mention exact case IDs and feature names.

Avoid vague phrases like "the AI was wrong." Say what was wrong and why.

## Worked Structure

You can think of the answer as a four-line note:

```text
Symptom: Case C-104 was predicted as risky, but the actual label was paid on time.
Evidence: late_payments and credit_utilization pushed risk up; stable_income pushed down.
Root cause: the model may over-trust shortcut risk signals, and the feature audit found leakage risk.
Fix: remove the leaking feature, audit decision-time availability, retrain, and compare errors.
```

Your exact wording can differ, but the answer should have this level of
specificity.

## Common Mistakes

Do not write an apology or a vague business statement. The mission asks for an
engineering note.

Do not skip the fix. If you only describe the problem, the model owner still
does not know what to do next.

Do not invent evidence outside the artifact. Use case IDs and feature names from
the provided JSON.

## What A Good Answer Looks Like

A good answer has a concrete symptom, a root cause that mentions leakage or
over-trust in shortcut features, a fix that removes or audits the bad feature,
and evidence specific enough for another person to verify.

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
