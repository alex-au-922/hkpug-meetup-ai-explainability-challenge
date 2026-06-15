# HKPUG AI Explainability Challenge

Beginner-friendly tutorial and GitHub Actions game for the July HKPUG
explainability and observability workshop.

Participant site:

https://alex-au-922.github.io/hkpug-meetup-ai-explainability-challenge/

## What This Is

This repo turns the July follow-up idea from `chatgpt-chat.txt` into a hands-on
learning trail:

- SHAP: explain why a normal machine-learning model made one prediction.
- Opik: inspect what happened inside an LLM, RAG, or agent workflow.
- GitHub Actions: score safe JSON submissions without running participant code.

The goal is simple: after this tutorial, a beginner should be able to say:

> The model predicted this because these features pushed it up or down, and the
> AI app failed because this trace step gave the model bad context.

## Start Here

1. Open the participant site.
2. Read **Rules** and **How To Play**.
3. Work through **SHAP for Humans** and **Opik for Humans**.
4. Submit mission JSON files under `submissions/<participant-id>/`.
5. Let GitHub Actions score your bundle.

## Local Checks

```bash
uv run pytest
uv run python -m challenge.scorer \
  --submission-root examples/ct-alex-au/submissions \
  --result artifacts/ct-alex-au-score.json
uv run --group docs mkdocs build --strict
```

## Project Layout

```text
challenge/      scoring engine used by GitHub Actions
docs/           participant-facing tutorial site
examples/       sample learner submissions
labs/           static artifacts used by the missions
submissions/    participant PR target
tests/          scorer tests
```

## Safety Design

The scoring workflow only reads JSON and Markdown under `submissions/`. It does
not execute participant code, does not use secrets, and does not use
`pull_request_target` for untrusted scoring.
