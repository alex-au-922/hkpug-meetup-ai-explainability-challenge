# Interactive Labs

This page is the fastest place to find the embedded interactions. The same
ideas are taught in the SHAP and Opik textbook chapters, but this page keeps the
hands-on pieces together.

Use the first lab to see how feature contributions change a model prediction.
Use the second lab to see how trace evidence identifies the broken step in an
LLM application.

## SHAP Force Playground

The model starts with a base risk value of `0.32`. Each control changes one
feature. The contribution bars show whether that feature pushes the prediction
up or down.

Things to try:

1. Click `Steady`, then increase credit utilization until the prediction crosses
   `0.50`.
2. Click `Stressed`, then turn on stable income and increase employment months.
3. Compare the terminal output with the bars. The signed numbers should explain
   the final prediction.

<div class="interactive-lab" data-shap-lab>
  <div class="interactive-lab__header">
    <div>
      <strong>SHAP force playground</strong>
      <span>Move the controls to see the prediction update.</span>
    </div>
    <div class="scenario-row" aria-label="Example scenarios">
      <button type="button" class="lab-button" data-scenario="c104">C-104</button>
      <button type="button" class="lab-button" data-scenario="steady">Steady</button>
      <button type="button" class="lab-button" data-scenario="stressed">Stressed</button>
    </div>
  </div>
  <div class="interactive-grid">
    <div class="control-stack">
      <label class="lab-control">
        <span>Late payments</span>
        <input type="range" min="0" max="4" step="1" value="2" data-shap-input="latePayments">
        <output data-shap-output="latePayments">2</output>
      </label>
      <label class="lab-control">
        <span>Credit utilization</span>
        <input type="range" min="10" max="100" step="1" value="91" data-shap-input="creditUtilization">
        <output data-shap-output="creditUtilization">91%</output>
      </label>
      <label class="lab-control">
        <span>Employment months</span>
        <input type="range" min="0" max="72" step="3" value="39" data-shap-input="employmentMonths">
        <output data-shap-output="employmentMonths">39</output>
      </label>
      <label class="lab-checkbox">
        <input type="checkbox" checked data-shap-input="stableIncome">
        <span>Stable income</span>
      </label>
    </div>
    <div class="interactive-output">
      <div class="score-meter" aria-label="Predicted risk">
        <div class="score-readout">
          <span>Predicted risk</span>
          <strong data-shap-prediction>0.59</strong>
          <em data-shap-verdict>late_repayment_risk</em>
        </div>
        <div class="score-meter__bar"><span data-shap-meter></span></div>
        <div class="score-meter__labels">
          <span>Base 0.32</span>
        </div>
      </div>
      <div class="shap-bars" data-shap-bars></div>
      <pre class="interactive-terminal" data-shap-terminal></pre>
    </div>
  </div>
</div>

The learning point is simple: a prediction is not only a label. It is a base
value plus feature effects. SHAP helps participants describe which inputs
changed the result and in what direction.

## Opik Trace Terminal

This terminal simulates the evidence you would inspect in an Opik trace. The two
traces use the same user question, but one returns the wrong context and one
returns useful policy context.

Commands to try:

| Command | What it teaches |
|---|---|
| `trace trace-003` | Select the failing request. |
| `spans` | Inspect retrieval and model-call steps. |
| `scores` | Read quantitative evaluator evidence. |
| `bad-span` | Identify the first broken step. |
| `trace trace-004` | Select the improved request. |
| `compare` | Quantify the before/after improvement. |
| `gate` | Convert the lesson into an automated quality check. |

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

The learning point is different from SHAP. Opik does not explain one tabular
model prediction. It helps participants debug an application workflow by naming
the broken span, citing the wrong evidence, and turning the failure into a
repeatable evaluation gate.
