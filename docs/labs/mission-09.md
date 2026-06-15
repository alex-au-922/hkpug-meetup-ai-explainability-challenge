# Mission 09: Safe Evidence Boundary

## Goal

Show that you know what is safe to submit and what must stay private.

## Artifact

```text
labs/artifacts/support_bot_traces.json
```

Open:

```text
safe_boundary
```

## What To Notice

Real observability data can contain sensitive information. In this challenge,
you only submit redacted toy evidence.

## Submit

```json
{
  "participant_id": "AIEX-YOUR-TEAM",
  "mission_id": "mission-09",
  "answer": {
    "allowed_artifact": "safe thing to submit",
    "forbidden_artifact": "unsafe thing to submit"
  },
  "evidence": [
    "The repo does not need real secrets because ..."
  ]
}
```

## Self Check

Would you be comfortable with your submitted evidence appearing on a public
projector during the meetup?
