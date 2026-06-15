# Mission 09: Safe Evidence Boundary

## Learning Objective

This mission teaches safe evidence handling. Observability is powerful because
it gives teams visibility into real requests. That same visibility can expose
private information if people are careless.

## Artifact

```text
labs/artifacts/support_bot_traces.json
```

Open:

```text
safe_boundary
```

## Background

Real observability data can contain sensitive information. In this challenge,
you only submit redacted toy evidence.

In a real project, traces may include user messages, retrieved document text,
tool arguments, internal URLs, or metadata. A public workshop repository should
not contain any of that. For this challenge, the safe evidence is already
provided in toy JSON files.

## Guided Reading

Open the `safe_boundary` section. It names what is allowed and what is
forbidden. Your answer should show that you understand both sides:

- what kind of artifact is safe to submit
- what kind of artifact must never be submitted

The evidence sentence should explain why the scoring repo does not need real
secrets.

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
