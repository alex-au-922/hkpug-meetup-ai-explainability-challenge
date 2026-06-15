# Glossary

## SHAP

A method for explaining how features contributed to a model output.

In this challenge, read SHAP as:

> Which features pushed the prediction up or down?

## Shapley Value

The game-theory idea behind SHAP. The short version: it assigns credit to each
player based on contribution. In ML, the players are features.

## Feature

One input column used by the model, such as `late_payments` or
`credit_utilization`.

## Global Explanation

An explanation across many rows. Useful for "what usually matters?"

## Local Explanation

An explanation for one row. Useful for "why did this one prediction happen?"

## Data Leakage

When a model uses information that would not be available at prediction time.

## Opik

An observability and evaluation platform for LLM, RAG, and agent applications.

In this challenge, read Opik as:

> The trace viewer and evaluator for AI app requests.

## Trace

The step-by-step record of one request. It can include retrieval, prompts, model
calls, tool calls, scores, latency, and outputs.

## Span

One step inside a trace, such as `retrieval` or `llm_call`.

## RAG

Retrieval-augmented generation. The app retrieves documents first, then asks the
LLM to answer using those documents.

## Evaluation Dataset

A saved set of examples used to test whether the AI app still behaves correctly
after a change.

## Regression

When a bug comes back after you thought it was fixed.
