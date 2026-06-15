# Rules

## Stay In The Sandbox

This challenge is about explaining toy artifacts. Do not use real user data,
real secrets, or private production traces.

!!! danger "No real secrets"
    Do not submit API keys, tokens, browser data, cloud credentials, private
    messages, customer records, or anything that looks like personal data.

!!! warning "No external callbacks"
    Do not send challenge data to webhooks, pastebins, callback servers, or
    third-party logging endpoints.

!!! success "Allowed"
    You may submit:

    - mission JSON files
    - short Markdown notes
    - redacted trace IDs from the toy artifacts
    - plain-English explanations

## GitHub Actions Boundary

The scoring workflow reads JSON files under `submissions/`. It does not execute
participant code.

That design is intentional. Explainability workshops should not teach people to
trust random code from pull requests.

## Automated Score Of Record

GitHub Actions is the score of record. The workflow runs the deterministic
scorer, prints a mission-by-mission table, and uploads the score artifact.

The challenge is still meant to be hard. Hardness comes from exact evidence
requirements, not manual judging. Mission 10 is the boss-level task: it requires
cross-artifact synthesis across SHAP evidence, Opik traces, metric movement,
safe evidence handling, and a concrete action plan.

Organizers can still read submissions for discussion or teaching moments, but
the core score does not depend on private judgement.
