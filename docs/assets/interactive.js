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

  const missionWidgets = {
    "mission-01": {
      title: "Mission 01 practice check",
      subtitle: "Route each debugging job to the right evidence workflow.",
      evidence:
        "Look for artifact type first: loan prediction evidence uses SHAP values; support-bot request evidence uses trace spans.",
      checks: [
        {
          prompt: "Loan case C-104 needs one model prediction explained.",
          choices: [
            {
              text: "SHAP",
              correct: true,
              feedback: "Correct. Use loan_risk_casebook.json, C-104, and shap_values.",
            },
            {
              text: "Opik",
              feedback: "Not for this job. There is no app trace to inspect.",
            },
            {
              text: "Safe evidence review only",
              feedback: "Safety matters later, but this job starts with feature contributions.",
            },
          ],
        },
        {
          prompt: "A support bot answered a refund question with Wi-Fi advice.",
          choices: [
            {
              text: "SHAP",
              feedback: "SHAP does not inspect retrieval or prompt spans.",
            },
            {
              text: "Opik",
              correct: true,
              feedback: "Correct. Use support_bot_traces.json, trace-003, and retrieval.",
            },
            {
              text: "Global feature ranking",
              feedback: "That belongs to the tabular model artifact, not the bot trace.",
            },
          ],
        },
        {
          prompt: "What shared failure pattern should the answer name?",
          choices: [
            {
              text: "wrong_output_needs_artifact_evidence",
              correct: true,
              feedback: "Correct. Both jobs need a claim backed by artifact evidence.",
            },
            {
              text: "high_accuracy_means_safe",
              feedback: "No. The tutorial is teaching evidence, not blind trust in scores.",
            },
            {
              text: "prompt_change_without_trace",
              feedback: "Too narrow. Mission 01 covers both SHAP and Opik evidence.",
            },
          ],
        },
      ],
    },
    "mission-02": {
      title: "Mission 02 practice check",
      subtitle: "Read the global SHAP ranking like a small bar chart.",
      evidence:
        "The values are mean_abs_shap: late_payments 0.31, credit_utilization 0.24, stable_income 0.17.",
      checks: [
        {
          prompt: "Which feature has the largest global importance?",
          choices: [
            {
              text: "late_payments at 0.31",
              correct: true,
              feedback: "Correct. It has the largest mean_abs_shap value.",
            },
            {
              text: "credit_utilization at 0.24",
              feedback: "Second place, not first.",
            },
            {
              text: "post_approval_call_count at 0.09",
              feedback: "That is the review-risk feature, not the largest feature.",
            },
          ],
        },
        {
          prompt: "What is the correct top-three order?",
          choices: [
            {
              text: "late_payments, credit_utilization, stable_income",
              correct: true,
              feedback: "Correct. The order follows 0.31, 0.24, then 0.17.",
            },
            {
              text: "stable_income, late_payments, credit_utilization",
              feedback: "No. Sort by value size, not by whether a feature is good.",
            },
            {
              text: "post_approval_call_count, late_payments, stable_income",
              feedback: "No. The suspicious feature is important to review, but it is not top three.",
            },
          ],
        },
        {
          prompt: "What is the margin between first and second place?",
          choices: [
            {
              text: "0.07",
              correct: true,
              feedback: "Correct. 0.31 minus 0.24 equals 0.07.",
            },
            {
              text: "0.14",
              feedback: "That is 0.31 minus 0.17, not first minus second.",
            },
            {
              text: "0.48",
              feedback: "That adds values; this mission asks for the difference.",
            },
          ],
        },
      ],
    },
    "mission-03": {
      title: "Mission 03 practice check",
      subtitle: "Identify the local push-up and push-down forces for C-104.",
      evidence:
        "C-104 starts at 0.32 and lands at 0.59, so the local net movement is 0.27.",
      checks: [
        {
          prompt: "Which feature is the strongest positive SHAP force?",
          choices: [
            {
              text: "late_payments +0.24",
              correct: true,
              feedback: "Correct. This is the largest risk-up contribution.",
            },
            {
              text: "credit_utilization +0.18",
              feedback: "It pushes risk up, but it is smaller than late_payments.",
            },
            {
              text: "stable_income -0.09",
              feedback: "That pushes risk down, not up.",
            },
          ],
        },
        {
          prompt: "Which feature is the strongest negative SHAP force?",
          choices: [
            {
              text: "stable_income -0.09",
              correct: true,
              feedback: "Correct. It is the strongest risk-down contribution.",
            },
            {
              text: "employment_months -0.06",
              feedback: "It pushes risk down, but less strongly.",
            },
            {
              text: "late_payments +0.24",
              feedback: "That is positive and pushes risk up.",
            },
          ],
        },
        {
          prompt: "What is predicted probability minus base probability?",
          choices: [
            {
              text: "0.27",
              correct: true,
              feedback: "Correct. 0.59 minus 0.32 equals 0.27.",
            },
            {
              text: "0.59",
              feedback: "That is the prediction, not the movement from base.",
            },
            {
              text: "-0.15",
              feedback: "No. The total movement is upward for this case.",
            },
          ],
        },
      ],
    },
    "mission-04": {
      title: "Mission 04 practice check",
      subtitle: "Apply the decision-time availability test.",
      evidence:
        "A feature known only after the loan decision cannot be used at approval time.",
      checks: [
        {
          prompt: "Which feature fails the availability test?",
          choices: [
            {
              text: "post_approval_call_count",
              correct: true,
              feedback: "Correct. The name itself says it happens after approval.",
            },
            {
              text: "employment_months",
              feedback: "That can be known before a loan decision.",
            },
            {
              text: "stable_income",
              feedback: "That can be checked before the decision.",
            },
          ],
        },
        {
          prompt: "What trap type should the answer name?",
          choices: [
            {
              text: "data_leakage",
              correct: true,
              feedback: "Correct. The model is peeking at future information.",
            },
            {
              text: "low context relevance",
              feedback: "That is an Opik trace metric, not this feature audit.",
            },
            {
              text: "false negative",
              feedback: "The mission is about invalid feature timing, not a label error.",
            },
          ],
        },
        {
          prompt: "Which mitigation is specific enough?",
          choices: [
            {
              text: "Remove the feature, audit availability, retrain",
              correct: true,
              feedback: "Correct. It names concrete engineering actions.",
            },
            {
              text: "Keep it because it improves the score",
              feedback: "No. Leakage can make tests look better while invalidating deployment.",
            },
            {
              text: "Ask the model to explain harder",
              feedback: "No. Explanation does not make a leaked feature valid.",
            },
          ],
        },
      ],
    },
    "mission-05": {
      title: "Mission 05 practice check",
      subtitle: "Turn SHAP and leakage evidence into an incident note.",
      evidence:
        "A complete note names C-104, the local drivers, post_approval_call_count, and a fix plan.",
      checks: [
        {
          prompt: "Which case should the note identify?",
          choices: [
            {
              text: "C-104",
              correct: true,
              feedback: "Correct. It is the wrong local prediction being reviewed.",
            },
            {
              text: "trace-003",
              feedback: "That belongs to the Opik trace missions.",
            },
            {
              text: "weather-refund-policy",
              feedback: "That is a regression dataset item, not the model case.",
            },
          ],
        },
        {
          prompt: "Which incident class fits C-104?",
          choices: [
            {
              text: "false positive / over-predicted risk",
              correct: true,
              feedback: "Correct. The model predicted risk, but the label was paid_on_time.",
            },
            {
              text: "retrieval context mismatch",
              feedback: "That belongs to the support-bot trace.",
            },
            {
              text: "missing participant profile",
              feedback: "No. The artifact has the case data needed for review.",
            },
          ],
        },
        {
          prompt: "Which fix plan matches the evidence?",
          choices: [
            {
              text: "Remove leakage, audit features, retrain",
              correct: true,
              feedback: "Correct. It handles both local and systemic model risk.",
            },
            {
              text: "Only change the chatbot prompt",
              feedback: "That does not address the loan-risk model evidence.",
            },
            {
              text: "Ignore the leakage because C-104 was local",
              feedback: "No. Local mistakes and systemic leakage can both matter.",
            },
          ],
        },
      ],
    },
    "mission-06": {
      title: "Mission 06 practice check",
      subtitle: "Find the first bad span before blaming the final answer.",
      evidence:
        "trace-003 retrieved venue Wi-Fi context for a typhoon refund question, then the answer followed the wrong context.",
      checks: [
        {
          prompt: "Which trace is the failing trace?",
          choices: [
            {
              text: "trace-003",
              correct: true,
              feedback: "Correct. This trace has the bad retrieval and low scores.",
            },
            {
              text: "trace-001",
              feedback: "That trace is marked ok.",
            },
            {
              text: "trace-004",
              feedback: "That is the fixed comparison trace.",
            },
          ],
        },
        {
          prompt: "Which span failed first?",
          choices: [
            {
              text: "retrieval",
              correct: true,
              feedback: "Correct. The wrong context appears before the model answer.",
            },
            {
              text: "final_answer",
              feedback: "The final answer is bad, but it is downstream of retrieval.",
            },
            {
              text: "score upload",
              feedback: "No. The trace artifact gives the failing app spans.",
            },
          ],
        },
        {
          prompt: "Which score pair supports the diagnosis?",
          choices: [
            {
              text: "context_relevance 0.22 and answer_correctness 0.08",
              correct: true,
              feedback: "Correct. Both metrics are low for trace-003.",
            },
            {
              text: "context_relevance 0.91 and answer_correctness 0.86",
              feedback: "Those are the improved trace-004 scores.",
            },
            {
              text: "mean_abs_shap 0.31 and 0.24",
              feedback: "Those are SHAP summary values, not trace scores.",
            },
          ],
        },
      ],
    },
    "mission-07": {
      title: "Mission 07 practice check",
      subtitle: "Convert the failure into a regression evaluation gate.",
      evidence:
        "The failed trace already names weather-refund-policy as the dataset item to preserve.",
      checks: [
        {
          prompt: "Which dataset item should preserve the failure?",
          choices: [
            {
              text: "weather-refund-policy",
              correct: true,
              feedback: "Correct. It captures the typhoon refund retrieval case.",
            },
            {
              text: "post_approval_call_count",
              feedback: "That is a model feature, not an Opik dataset item.",
            },
            {
              text: "late_payments",
              feedback: "That belongs to the loan model artifact.",
            },
          ],
        },
        {
          prompt: "What context should a fixed system retrieve?",
          choices: [
            {
              text: "weather policy, cancellation notice, refund handling",
              correct: true,
              feedback: "Correct. That context matches the user's intent.",
            },
            {
              text: "venue Wi-Fi policy",
              feedback: "That is the bad context from trace-003.",
            },
            {
              text: "feature contribution values",
              feedback: "Those do not answer the support-bot question.",
            },
          ],
        },
        {
          prompt: "Which gate is concrete enough?",
          choices: [
            {
              text: "context_relevance >= 0.85 and answer_correctness >= 0.80",
              correct: true,
              feedback: "Correct. It gives both metric thresholds.",
            },
            {
              text: "answer should feel better",
              feedback: "No. A gate needs measurable pass/fail criteria.",
            },
            {
              text: "only check latency",
              feedback: "Latency does not catch this retrieval-quality failure.",
            },
          ],
        },
      ],
    },
    "mission-08": {
      title: "Mission 08 practice check",
      subtitle: "Calculate improvement with the same input before and after.",
      evidence:
        "trace-003 and trace-004 use the same typhoon refund question, so their scores can be compared.",
      checks: [
        {
          prompt: "Which pair makes a fair comparison?",
          choices: [
            {
              text: "trace-003 before and trace-004 after",
              correct: true,
              feedback: "Correct. Same input, changed retrieval behavior.",
            },
            {
              text: "trace-001 and C-104",
              feedback: "No. That mixes a trace with a model case.",
            },
            {
              text: "C-104 and C-219",
              feedback: "No. That is a model comparison, not the support-bot fix.",
            },
          ],
        },
        {
          prompt: "What is the context relevance delta?",
          choices: [
            {
              text: "0.69",
              correct: true,
              feedback: "Correct. 0.91 minus 0.22 equals 0.69.",
            },
            {
              text: "0.78",
              feedback: "That is the answer correctness delta.",
            },
            {
              text: "0.27",
              feedback: "That is the local SHAP net movement.",
            },
          ],
        },
        {
          prompt: "What changed between the traces?",
          choices: [
            {
              text: "retrieval routed to event-policy context",
              correct: true,
              feedback: "Correct. The context changed from venue Wi-Fi to event policy.",
            },
            {
              text: "the user asked a different question",
              feedback: "No. The same question is what makes the comparison fair.",
            },
            {
              text: "the loan feature was removed",
              feedback: "That belongs to model leakage, not this trace comparison.",
            },
          ],
        },
      ],
    },
    "mission-09": {
      title: "Mission 09 practice check",
      subtitle: "Separate useful public evidence from unsafe raw material.",
      evidence:
        "The public repo only needs redacted IDs, scores, and diagnosis from toy artifacts.",
      checks: [
        {
          prompt: "Which bundle is safe for the public challenge repo?",
          choices: [
            {
              text: "redacted trace IDs, scores, and diagnosis",
              correct: true,
              feedback: "Correct. This is enough for scoring and review.",
            },
            {
              text: "API keys and access tokens",
              feedback: "Never submit secrets as evidence.",
            },
            {
              text: "private customer messages",
              feedback: "No. Public evidence must avoid private data.",
            },
          ],
        },
        {
          prompt: "Which item must be forbidden?",
          choices: [
            {
              text: "credentials and personal data",
              correct: true,
              feedback: "Correct. They are unsafe and unnecessary.",
            },
            {
              text: "trace-003",
              feedback: "A redacted toy trace ID is allowed.",
            },
            {
              text: "context_relevance 0.22",
              feedback: "A toy metric score is allowed.",
            },
          ],
        },
        {
          prompt: "Which redaction rule is strongest?",
          choices: [
            {
              text: "Public submissions need no secrets",
              correct: true,
              feedback: "Correct. Use the challenge artifacts, not private logs.",
            },
            {
              text: "Screenshots are always stronger",
              feedback: "No. Screenshots can leak private data.",
            },
            {
              text: "Paste tokens if the scorer fails",
              feedback: "No. Tokens are never evidence for a public repo.",
            },
          ],
        },
      ],
    },
    "mission-10": {
      title: "Mission 10 capstone check",
      subtitle: "Keep SHAP, leakage, Opik, evaluation, and safety separate.",
      evidence:
        "A strong capstone names C-104, post_approval_call_count, trace-003, trace-004, score movement, dataset item, and safe boundaries.",
      checks: [
        {
          prompt: "Which SHAP-side evidence belongs in the capstone?",
          choices: [
            {
              text: "C-104 with late_payments, credit_utilization, stable_income",
              correct: true,
              feedback: "Correct. It names the case and both risk-up/risk-down evidence.",
            },
            {
              text: "trace-003 with venue Wi-Fi context",
              feedback: "That belongs to the Opik-side evidence.",
            },
            {
              text: "weather-refund-policy only",
              feedback: "That is the regression dataset item, not the SHAP case.",
            },
          ],
        },
        {
          prompt: "Which Opik-side evidence belongs in the capstone?",
          choices: [
            {
              text: "trace-003 failed retrieval; trace-004 fixed retrieval",
              correct: true,
              feedback: "Correct. The capstone needs diagnosis and before/after evidence.",
            },
            {
              text: "post_approval_call_count is high",
              feedback: "That is the leakage feature, not a trace span.",
            },
            {
              text: "late_payments has mean_abs_shap 0.31",
              feedback: "That is model summary evidence, not app trace evidence.",
            },
          ],
        },
        {
          prompt: "Which next action is concrete enough?",
          choices: [
            {
              text: "Remove leakage, retrain, add weather-refund evaluation gate",
              correct: true,
              feedback: "Correct. It covers model remediation and app regression testing.",
            },
            {
              text: "Make the AI better",
              feedback: "Too vague. The action must name what changes.",
            },
            {
              text: "Upload production logs to GitHub",
              feedback: "No. The safe boundary rejects private logs and secrets.",
            },
          ],
        },
      ],
    },
  };

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function initMissionWidget(root) {
    const config = missionWidgets[root.dataset.missionWidget];
    if (!config) {
      return;
    }
    root.innerHTML = [
      '<div class="mission-widget__header">',
      "<div>",
      `<strong>${escapeHtml(config.title)}</strong>`,
      `<span>${escapeHtml(config.subtitle)}</span>`,
      "</div>",
      '<div class="mission-progress">',
      '<div class="mission-progress__label" data-mission-progress-label>0 of 3 correct</div>',
      '<div class="mission-progress__bar"><span data-mission-progress-bar></span></div>',
      "</div>",
      "</div>",
      '<div class="mission-widget__body">',
      ...config.checks.map((check, checkIndex) =>
        [
          '<section class="mission-check">',
          `<div class="mission-check__prompt">${escapeHtml(check.prompt)}</div>`,
          '<div class="mission-choices">',
          ...check.choices.map(
            (choice, choiceIndex) =>
              `<button type="button" class="mission-choice" data-check-index="${checkIndex}" data-choice-index="${choiceIndex}">${escapeHtml(choice.text)}</button>`,
          ),
          "</div>",
          `<div class="mission-feedback" data-feedback-index="${checkIndex}" aria-live="polite"></div>`,
          "</section>",
        ].join(""),
      ),
      `<p class="mission-widget__evidence"><strong>Evidence target:</strong> ${escapeHtml(config.evidence)}</p>`,
      "</div>",
    ].join("");

    const progressLabel = root.querySelector("[data-mission-progress-label]");
    const progressBar = root.querySelector("[data-mission-progress-bar]");
    const answers = new Map();

    function updateProgress() {
      const correct = [...answers.values()].filter(Boolean).length;
      progressLabel.textContent = `${correct} of ${config.checks.length} correct`;
      progressBar.style.width = `${Math.round(
        (correct / config.checks.length) * 100,
      )}%`;
    }

    root.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }
      const button = event.target.closest(".mission-choice");
      if (!button || !root.contains(button)) {
        return;
      }
      const checkIndex = Number(button.dataset.checkIndex);
      const choiceIndex = Number(button.dataset.choiceIndex);
      const choice = config.checks[checkIndex].choices[choiceIndex];
      root
        .querySelectorAll(`.mission-choice[data-check-index="${checkIndex}"]`)
        .forEach((item) => {
          item.classList.remove("mission-choice--correct", "mission-choice--wrong");
        });
      button.classList.add(
        choice.correct ? "mission-choice--correct" : "mission-choice--wrong",
      );
      const feedback = root.querySelector(`[data-feedback-index="${checkIndex}"]`);
      feedback.dataset.state = choice.correct ? "correct" : "wrong";
      feedback.textContent = choice.feedback;
      answers.set(checkIndex, Boolean(choice.correct));
      updateProgress();
    });
  }

  function initInteractiveLabs() {
    document.querySelectorAll("[data-shap-lab]").forEach(initShapLab);
    document.querySelectorAll("[data-opik-terminal]").forEach(initOpikTerminal);
    document.querySelectorAll("[data-mission-widget]").forEach(initMissionWidget);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initInteractiveLabs);
  } else {
    initInteractiveLabs();
  }
})();
