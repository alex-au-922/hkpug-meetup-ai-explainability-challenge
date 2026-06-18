(function () {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const format = (value) => value.toFixed(2);
  const signed = (value) => `${value >= 0 ? "+" : ""}${format(value)}`;

  function initShapLab(root) {
    const inputs = {
      latePayments: root.querySelector('[data-shap-input="latePayments"]'),
      creditUtilization: root.querySelector(
        '[data-shap-input="creditUtilization"]',
      ),
      employmentMonths: root.querySelector(
        '[data-shap-input="employmentMonths"]',
      ),
      stableIncome: root.querySelector('[data-shap-input="stableIncome"]'),
    };
    const outputs = {
      latePayments: root.querySelector('[data-shap-output="latePayments"]'),
      creditUtilization: root.querySelector(
        '[data-shap-output="creditUtilization"]',
      ),
      employmentMonths: root.querySelector(
        '[data-shap-output="employmentMonths"]',
      ),
    };
    const bars = root.querySelector("[data-shap-bars]");
    const meter = root.querySelector("[data-shap-meter]");
    const prediction = root.querySelector("[data-shap-prediction]");
    const verdict = root.querySelector("[data-shap-verdict]");
    const terminal = root.querySelector("[data-shap-terminal]");
    const scenarios = {
      c104: {
        latePayments: 2,
        creditUtilization: 91,
        employmentMonths: 39,
        stableIncome: true,
      },
      steady: {
        latePayments: 0,
        creditUtilization: 32,
        employmentMonths: 60,
        stableIncome: true,
      },
      stressed: {
        latePayments: 4,
        creditUtilization: 96,
        employmentMonths: 9,
        stableIncome: false,
      },
    };

    function readState() {
      return {
        latePayments: Number(inputs.latePayments.value),
        creditUtilization: Number(inputs.creditUtilization.value),
        employmentMonths: Number(inputs.employmentMonths.value),
        stableIncome: inputs.stableIncome.checked,
      };
    }

    function contributions(state) {
      return [
        {
          name: "late_payments",
          detail: `${state.latePayments} late payments`,
          value: state.latePayments * 0.12,
        },
        {
          name: "credit_utilization",
          detail: `${state.creditUtilization}% utilization`,
          value: (state.creditUtilization - 55) * 0.005,
        },
        {
          name: "stable_income",
          detail: state.stableIncome ? "stable income" : "unstable income",
          value: state.stableIncome ? -0.09 : 0.08,
        },
        {
          name: "employment_months",
          detail: `${state.employmentMonths} months`,
          value: (24 - state.employmentMonths) * 0.004,
        },
      ].map((item) => ({ ...item, value: Number(item.value.toFixed(2)) }));
    }

    function render() {
      const state = readState();
      const items = contributions(state);
      const total = items.reduce((sum, item) => sum + item.value, 0);
      const risk = clamp(0.32 + total, 0.01, 0.99);
      const label = risk >= 0.5 ? "late_repayment_risk" : "lower_risk";

      outputs.latePayments.textContent = String(state.latePayments);
      outputs.creditUtilization.textContent = `${state.creditUtilization}%`;
      outputs.employmentMonths.textContent = String(state.employmentMonths);
      meter.style.width = `${Math.round(risk * 100)}%`;
      prediction.textContent = format(risk);
      verdict.textContent = label;
      bars.innerHTML = items
        .map((item) => {
          const kind = item.value >= 0 ? "positive" : "negative";
          const width = clamp(Math.abs(item.value) * 190, 8, 100);
          return [
            '<div class="shap-bar-row">',
            `<span class="shap-bar-name">${item.name}</span>`,
            '<span class="shap-bar-track">',
            `<span class="shap-bar-fill ${kind}" style="width:${width}%"></span>`,
            "</span>",
            `<span class="shap-bar-value ${kind}">${signed(item.value)}</span>`,
            "</div>",
          ].join("");
        })
        .join("");
      terminal.textContent = [
        "$ shap explain custom-row",
        "base_value = 0.32",
        ...items.map(
          (item) =>
            `${item.name.padEnd(20)} ${item.detail.padEnd(18)} ${signed(
              item.value,
            )}`,
        ),
        `prediction = ${format(risk)} -> ${label}`,
      ].join("\n");
    }

    Object.values(inputs).forEach((input) => {
      input.addEventListener("input", render);
      input.addEventListener("change", render);
    });
    root.querySelectorAll("[data-scenario]").forEach((button) => {
      button.addEventListener("click", () => {
        const scenario = scenarios[button.dataset.scenario];
        inputs.latePayments.value = scenario.latePayments;
        inputs.creditUtilization.value = scenario.creditUtilization;
        inputs.employmentMonths.value = scenario.employmentMonths;
        inputs.stableIncome.checked = scenario.stableIncome;
        render();
      });
    });
    render();
  }

  function initOpikTerminal(root) {
    const traces = {
      "trace-003": {
        status: "bad_context",
        input: "If typhoon signal 8 happens, can I get a refund?",
        answer: "Wi-Fi password instructions",
        scores: { context_relevance: 0.22, answer_correctness: 0.08 },
        spans: [
          {
            name: "retrieval",
            status: "bad_context",
            output: "venue wifi policy, check-in desk note, projector setup guide",
          },
          {
            name: "llm_call",
            status: "bad_answer",
            output: "answered a Wi-Fi question instead of a refund question",
          },
        ],
      },
      "trace-004": {
        status: "ok",
        input: "If typhoon signal 8 happens, can I get a refund?",
        answer: "Weather cancellation and refund handling notice",
        scores: { context_relevance: 0.91, answer_correctness: 0.86 },
        spans: [
          {
            name: "retrieval",
            status: "ok",
            output: "weather policy, cancellation notice, refund handling note",
          },
          {
            name: "llm_call",
            status: "ok",
            output: "answered with weather policy context",
          },
        ],
      },
    };
    let selected = "trace-003";
    const output = root.querySelector("[data-terminal-output]");
    const input = root.querySelector("[data-terminal-input]");
    const form = root.querySelector("[data-terminal-form]");
    const status = root.querySelector("[data-trace-status]");
    const title = root.querySelector("[data-trace-title]");
    const traceInput = root.querySelector("[data-trace-input]");
    const spanList = root.querySelector("[data-trace-spans]");
    const history = [];

    function print(lines) {
      history.push(...lines);
      while (history.length > 80) {
        history.shift();
      }
      output.textContent = history.join("\n");
      output.scrollTop = output.scrollHeight;
    }

    function renderTrace() {
      const trace = traces[selected];
      status.textContent = trace.status;
      status.classList.toggle("trace-pill--bad", trace.status !== "ok");
      title.textContent = selected;
      traceInput.textContent = trace.input;
      spanList.innerHTML = trace.spans
        .map(
          (span) =>
            `<div class="trace-span ${
              span.status === "ok" ? "" : "trace-span--bad"
            }"><strong>${span.name}</strong><span>${span.status}</span><p>${
              span.output
            }</p></div>`,
        )
        .join("");
      root.querySelectorAll("[data-trace-id]").forEach((button) => {
        button.classList.toggle(
          "lab-button--active",
          button.dataset.traceId === selected,
        );
      });
    }

    function run(command) {
      const normalized = command.trim().toLowerCase();
      if (!normalized) {
        return;
      }
      if (normalized === "clear") {
        history.length = 0;
        output.textContent = "";
        return;
      }
      print([`$ ${command}`]);
      if (normalized === "help") {
        print([
          "commands: trace trace-003, trace trace-004, spans, scores, bad-span, compare, gate, clear",
        ]);
      } else if (normalized === "trace trace-003" || normalized === "trace-003") {
        selected = "trace-003";
        renderTrace();
        print(["selected trace-003: retrieval returns venue Wi-Fi context"]);
      } else if (normalized === "trace trace-004" || normalized === "trace-004") {
        selected = "trace-004";
        renderTrace();
        print(["selected trace-004: retrieval returns event-policy context"]);
      } else if (normalized === "spans") {
        print(
          traces[selected].spans.map(
            (span) => `${span.name}: ${span.status} -> ${span.output}`,
          ),
        );
      } else if (normalized === "scores") {
        const score = traces[selected].scores;
        print([
          `context_relevance=${format(score.context_relevance)}`,
          `answer_correctness=${format(score.answer_correctness)}`,
        ]);
      } else if (normalized === "bad-span") {
        print([
          "trace-003 first bad span: retrieval",
          "reason: refund question received venue Wi-Fi context",
        ]);
      } else if (normalized === "compare") {
        print([
          "same input in trace-003 and trace-004",
          "context_relevance delta: 0.91 - 0.22 = 0.69",
          "answer_correctness delta: 0.86 - 0.08 = 0.78",
        ]);
      } else if (normalized === "gate") {
        print([
          "dataset_item=weather-refund-policy",
          "gate: context_relevance >= 0.85 and answer_correctness >= 0.80",
          "action: fail or block the run when either score drops",
        ]);
      } else {
        print(["unknown command. Try: help"]);
      }
    }

    root.querySelectorAll("[data-trace-id]").forEach((button) => {
      button.addEventListener("click", () => {
        selected = button.dataset.traceId;
        renderTrace();
        run(`trace ${selected}`);
      });
    });
    root.querySelectorAll("[data-command]").forEach((button) => {
      button.addEventListener("click", () => {
        input.value = button.dataset.command;
        run(input.value);
      });
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      run(input.value);
      input.select();
    });
    renderTrace();
    run("help");
  }

  function initInteractiveLabs() {
    document.querySelectorAll("[data-shap-lab]").forEach(initShapLab);
    document.querySelectorAll("[data-opik-terminal]").forEach(initOpikTerminal);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initInteractiveLabs);
  } else {
    initInteractiveLabs();
  }
})();
