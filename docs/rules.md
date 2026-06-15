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

## Human Review

The automatic score checks whether your answer points at the right evidence.
Organizers may still review final capstone writeups for clarity before awarding
certificates or prizes.
