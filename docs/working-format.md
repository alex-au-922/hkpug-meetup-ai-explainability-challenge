# How To Play

## Folder Format

Pick a participant ID:

```text
AIEX-YOUR-TEAM
```

Use uppercase letters, digits, and dashes.

Create files like:

```text
submissions/AIEX-YOUR-TEAM/
  profile.json
  mission-01.json
  mission-02.json
```

## Mission JSON Format

Each mission file has this shape:

```json
{
  "participant_id": "AIEX-YOUR-TEAM",
  "mission_id": "mission-01",
  "answer": {
    "shap_scope": "one model prediction",
    "opik_scope": "one AI app trace"
  },
  "evidence": [
    "SHAP is useful when the model prediction is wrong because it shows which features pushed the score.",
    "Opik is useful when the AI app answer is wrong because the trace shows retrieval, prompt, and output steps."
  ]
}
```

## Local Scoring

```bash
uv run python -m challenge.scorer \
  --submission-root submissions \
  --participant-id AIEX-YOUR-TEAM \
  --result artifacts/my-score.json
```

The scorer returns a table of mission scores. Missing missions are shown as
missing, which is fine while you are still working.

## Pull Request Flow

1. Fork the repo.
2. Create a branch named `submissions/AIEX-YOUR-TEAM`.
3. Add or update files under `submissions/AIEX-YOUR-TEAM/`.
4. Open one long-lived PR.
5. Keep pushing updates to the same PR.

## Score Tiers

| Tier | Score | Meaning |
|---|---:|---|
| Trace Reader | 40+ | You can inspect evidence without guessing. |
| Debugger | 70+ | You can explain SHAP and Opik failures clearly. |
| Incident Lead | 90+ | You can write a useful AI incident report. |
