# Chapter 2: Opik For Humans

Opik is observability and evaluation tooling for LLM, RAG, and agent
applications. In this tutorial, the central idea is:

> Opik helps you inspect the path an AI request took before it produced an
> answer.

That path matters because modern AI applications are rarely a single model call.
A user asks a question, the app may retrieve documents, build a prompt, call a
model, call tools, run evaluators, and store feedback. When the final answer is
wrong, the model is only one possible cause. The failure might have happened
earlier.

## 2.1 Why Observability Is Needed

Traditional software teams use logs, metrics, and traces. If a checkout page is
slow, they inspect which service or database query took too long. AI apps need a
similar habit, but the evidence is different.

For an LLM or RAG system, we may need to inspect:

- the user's input
- the retrieved documents
- the assembled prompt
- the model response
- the tool calls
- the evaluator scores
- latency, token usage, and errors

Without this evidence, teams often debug by guessing. They say "the model is
bad" or "the prompt needs work" without knowing whether the retriever, prompt,
tool, or model actually caused the failure.

Opik gives us a structured place to inspect that evidence.

## 2.2 Vocabulary

| Term | Meaning in this tutorial |
|---|---|
| LLM | A large language model that generates text |
| RAG | Retrieval-augmented generation: retrieve documents, then answer |
| Agent | An AI workflow that may choose tools or steps |
| Trace | The record of one AI request |
| Span | One step inside a trace, such as retrieval or an LLM call |
| Evaluation | A score or judgement about output quality |
| Dataset item | A saved example used for repeatable testing |
| Regression | A bug that returns after a change |

The key word is trace. A trace is not just a log message. It is the structured
story of one request.

## 2.3 The Receipt Mental Model

A shop receipt tells you what happened in a purchase:

- what was bought
- when it happened
- how much it cost
- how the total was calculated

An AI trace is similar. It tells you what happened inside one AI request:

- what the user asked
- what context was retrieved
- what prompt was sent
- what tool was called
- what the model answered
- what scores or feedback were attached
- how long the steps took

If the final answer is bad, the trace is the receipt you inspect before making a
claim.

## 2.4 Where Opik Fits In An AI App

Consider a small event support bot. The user asks:

> If typhoon signal 8 happens, can I get a refund?

A RAG-style app might handle the question like this:

<div class="interactive-lab" data-opik-terminal>
  <div class="interactive-lab__header">
    <div>
      <strong>Opik trace terminal</strong>
      <span>Run trace commands to inspect the request path.</span>
    </div>
    <div class="scenario-row" aria-label="Trace selector">
      <button type="button" class="lab-button" data-trace-id="trace-003">trace-003</button>
      <button type="button" class="lab-button" data-trace-id="trace-004">trace-004</button>
    </div>
  </div>
  <div class="interactive-grid">
    <div class="trace-panel">
      <div class="trace-summary">
        <span class="trace-pill" data-trace-status>bad_context</span>
        <strong data-trace-title>trace-003</strong>
        <p data-trace-input>If typhoon signal 8 happens, can I get a refund?</p>
      </div>
      <div class="trace-spans" data-trace-spans></div>
    </div>
    <div class="terminal-panel">
      <pre class="interactive-terminal" data-terminal-output></pre>
      <form class="terminal-command" data-terminal-form>
        <span>$</span>
        <input type="text" value="help" aria-label="Trace command" data-terminal-input>
        <button type="submit" class="lab-button">Run</button>
      </form>
      <div class="command-row" aria-label="Command shortcuts">
        <button type="button" class="lab-button" data-command="trace trace-003">trace 003</button>
        <button type="button" class="lab-button" data-command="bad-span">bad span</button>
        <button type="button" class="lab-button" data-command="compare">compare</button>
        <button type="button" class="lab-button" data-command="gate">gate</button>
      </div>
    </div>
  </div>
</div>

If the app answers with Wi-Fi instructions, the model output is wrong. But the
trace helps us ask a sharper question:

> Did the model ignore good context, or did retrieval give it the wrong context?

Those are different failures. They need different fixes.

## 2.5 Worked Example: Reading A Bad Trace

The challenge artifact contains a failing trace:

```text
trace_id: trace-003
user_input: If typhoon signal 8 happens, can I get a refund?
retrieval output: venue wifi policy, check-in desk note, projector setup guide
final_answer: You can ask the venue staff for the Wi-Fi password at the front desk.
context_relevance: 0.22
answer_correctness: 0.08
```

Read this like an incident report.

The user asked about typhoon refunds. The retriever returned venue Wi-Fi and
setup documents. The model then answered using the wrong topic. The low
`context_relevance` score supports the diagnosis: the retrieved context did not
match the user question.

A good plain-English explanation would be:

> `trace-003` failed at the retrieval step. The user asked about typhoon refunds,
> but retrieval returned venue Wi-Fi context. The model then answered the wrong
> question. The low context relevance score confirms that the context was the
> problem.

Notice that this explanation does not blame "AI randomness." It names the
broken step and cites evidence.

## 2.6 Trace vs Log

A basic log might say:

```text
request completed
```

or:

```text
answer quality low
```

That is not enough for debugging. It tells us something went wrong, but not why.

A useful trace says:

```text
user asked about typhoon refunds
retriever returned venue Wi-Fi policy
model answered with Wi-Fi information
context_relevance score was 0.22
```

The second version points to a fix: improve retrieval routing for weather and
refund policy questions.

## 2.7 From Trace To Evaluation

A trace explains one failure. An evaluation prevents that failure from quietly
returning.

The loop is:

1. Find a bad trace.
2. Turn the user question and expected behavior into a dataset item.
3. Choose a metric to watch, such as `context_relevance`.
4. Change the retriever, prompt, tool, or model.
5. Run the dataset again.
6. Compare before and after results.

In the toy artifact, `trace-003` becomes the dataset item
`weather-refund-policy`. After the retrieval route changes, `trace-004` improves
the context relevance score from `0.22` to `0.91`.

This is the important operational habit: do not only fix the bug. Save the bug
as a test so the team can detect it next time.

## 2.8 SHAP vs Opik

SHAP and Opik can both support AI debugging, but they work at different levels.

| Question | Tool |
|---|---|
| Why did this tabular model predict high risk? | SHAP |
| Which feature pushed this row up or down? | SHAP |
| Why did this RAG bot answer the wrong question? | Opik |
| Which app step failed: retrieval, prompt, tool, or model? | Opik |
| Did our fix improve the same failure case? | Opik evaluation |

If you are looking at feature contributions for one model prediction, think
SHAP. If you are looking at the sequence of steps in an LLM app request, think
Opik.

## 2.9 Safe Evidence Handling

Real traces can contain private information. A production trace might include a
customer question, internal document text, tool arguments, or API metadata.

For this public challenge, submit only toy evidence:

- redacted trace IDs
- evaluator scores from the provided artifact
- plain-English diagnosis
- JSON writeups

Do not submit secrets, API keys, access tokens, private user messages, or
personal data. Observability is useful because it gives teams visibility. That
same visibility must be handled carefully.

## 2.10 Review Questions

Before starting the Opik missions, check whether you can answer these:

1. What is the difference between a trace and a normal log line?
2. In `trace-003`, what did the user ask?
3. Which step returned irrelevant context?
4. Which score supports the diagnosis?
5. Why should a bad trace become a dataset item?

## Source

The official [Opik documentation](https://www.comet.com/docs/opik) describes
Opik around traces, evaluations, datasets, production monitoring, and prompt
optimization for LLM applications.
