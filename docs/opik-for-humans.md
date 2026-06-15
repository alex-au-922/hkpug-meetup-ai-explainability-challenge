# Opik For Humans

Opik is observability and evaluation tooling for LLM, RAG, and agent apps.

Plain version:

> Opik gives you the receipt for what the AI app did.

If a chatbot gives a bad answer, you do not want to shrug and say "LLMs are
random." You want to inspect the request.

## The Receipt Mental Model

A normal shop receipt tells you:

- what was bought
- when it happened
- how much it cost
- where the total came from

An AI trace tells you:

- what the user asked
- what documents were retrieved
- what prompt was sent
- what tool was called
- what the model answered
- what scores or feedback it got
- how long it took

## Where Opik Fits

Opik is useful when your app has steps:

```mermaid
flowchart LR
  User["User asks question"] --> Retrieval["Retriever finds context"]
  Retrieval --> Prompt["Prompt is assembled"]
  Prompt --> Model["LLM call"]
  Model --> Eval["Evaluator scores answer"]
  Eval --> Trace["Trace saved for debugging"]
```

If the final answer is bad, the trace helps you find the step that broke.

## Trace vs Log

A log line says:

```text
request failed
```

A trace says:

```text
user asked about typhoon refunds
retriever returned venue Wi-Fi policy
model answered with Wi-Fi information
context_relevance score was 0.22
```

That second version tells you what to fix.

## Evaluation Loop

Opik is not just a pretty trace viewer. The useful loop is:

1. Find a bad trace.
2. Turn it into a test case.
3. Change retrieval, prompt, tool, or model settings.
4. Run the test again.
5. Compare the before and after scores.

For the toy artifact in this challenge, `trace-003` fails because retrieval gave
the model irrelevant venue Wi-Fi context for a weather refund question.
`trace-004` improves after routing the retriever to event-policy documents.

## SHAP vs Opik

| Question | Tool |
|---|---|
| Why did this model predict high risk? | SHAP |
| Which feature pushed this row up or down? | SHAP |
| Why did this RAG bot answer nonsense? | Opik |
| Which app step failed: retrieval, prompt, tool, or model? | Opik |

## Source

The official [Opik documentation](https://www.comet.com/docs/opik) describes
Opik around traces, evaluations, datasets, production monitoring, and prompt
optimization for LLM applications.
