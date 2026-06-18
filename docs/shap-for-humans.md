# Chapter 1: SHAP For Humans

SHAP is a method for explaining a model prediction. In this challenge, we use it
to answer a simple question:

> Which input features pushed this prediction up, and which pushed it down?

That sentence is the most important thing in this chapter. If you remember only
one idea, remember that SHAP is about assigning contribution. It does not merely
say "this feature exists" or "this feature is correlated." It tries to describe
how much each feature contributed to the model output for a particular
prediction.

## 1.1 Why Explain A Prediction?

Imagine a loan-risk model predicts that an applicant has a high chance of late
repayment. A human reviewer may ask:

- Was the model worried about previous late payments?
- Was the model worried about high credit utilization?
- Did stable income reduce the risk?
- Did the model use a feature that should not be available?

Without an explanation, the prediction is just a number. With an explanation, we
can inspect the reasons behind the number. This does not automatically make the
model fair, correct, or trustworthy, but it gives us something concrete to
review.

In real work, SHAP can help with several jobs:

| Job | Question |
|---|---|
| Debugging | Why did the model make a surprising prediction? |
| Model review | Which features matter most across many examples? |
| Communication | How do we explain a prediction to a non-ML teammate? |
| Risk control | Is the model relying on a suspicious shortcut? |

## 1.2 Vocabulary

Before reading the artifact, learn these words.

| Term | Meaning in this tutorial |
|---|---|
| Model | A function that turns input data into a prediction |
| Feature | One input column, such as `late_payments` |
| Prediction | The model's output for one row |
| Base value | The model's starting point before row-specific features push it |
| SHAP value | A feature's contribution to the prediction |
| Positive SHAP value | Pushes the prediction upward |
| Negative SHAP value | Pushes the prediction downward |

For the loan-risk example, "upward" means "toward higher risk" and "downward"
means "toward lower risk." In another model, upward might mean something else,
such as a higher house price or a higher probability of churn. Always ask what
the model output means before interpreting the sign.

## 1.3 The Restaurant Bill Mental Model

Imagine four friends share a dinner bill. The final bill is HKD 800. You want to
know how much each friend contributed to that total.

For a model, the "bill" is the final prediction. The "friends" are the input
features. SHAP asks:

> If this prediction is the final total, how much credit or blame should each
> feature receive?

In the toy loan model, the features are things like:

- `late_payments`
- `credit_utilization`
- `stable_income`
- `employment_months`

Each feature receives a contribution. A positive contribution pushes the risk
score up. A negative contribution pulls it down.

## 1.4 Worked Example: Local Explanation

The artifact contains this simplified explanation for case `C-104`:

```text
base risk: 0.32
late_payments: +0.24
credit_utilization: +0.18
stable_income: -0.09
employment_months: -0.06
final risk: about 0.59
```

Read it slowly.

The model starts from a base risk of `0.32`. That does not mean every person has
exactly that risk. It is the reference point for this explanation. Then the
features for this specific row move the prediction.

`late_payments` contributes `+0.24`, so it pushes the risk score up.
`credit_utilization` contributes `+0.18`, so it also pushes the risk score up.
`stable_income` contributes `-0.09`, so it pushes the risk score down.
`employment_months` contributes `-0.06`, so it also pushes the risk score down.

A plain-English explanation would be:

> The model started around 0.32. Two late payments and high credit utilization
> pushed the risk score upward. Stable income and a longer employment history
> pushed it downward, but the upward forces were larger, so the final prediction
> crossed into the risky side.

That is the style of explanation we want in the missions. Do not merely copy
numbers. Explain the direction and the conclusion.

### Try The SHAP Playground

Change the applicant profile below. Watch how each feature contribution moves
the final risk score.

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

## 1.5 Global vs Local SHAP

There are two common ways to use SHAP.

Global SHAP asks:

> Across many rows, which features usually matter most?

Local SHAP asks:

> For this one row, why did the model make this one prediction?

These are related, but they are not the same. A feature can be globally
important but barely matter for one specific row. A feature can also be modest on
average but extremely important for one unusual row.

| Explanation type | Unit of analysis | Good for |
|---|---|---|
| Global | Many rows | Understanding model behavior overall |
| Local | One row | Explaining one prediction |

In the challenge artifact, the `global_summary` section lists
`mean_abs_shap`. This means "average absolute SHAP value." It ignores whether a
feature pushed up or down and asks only how strongly the feature usually moved
predictions. A larger value means the feature usually has a larger effect.

## 1.6 The Important Trap: Explanation Is Not Approval

SHAP can tell you what the model used. It cannot automatically tell you whether
the model should have used it.

That distinction is essential.

Suppose a feature named `post_approval_call_count` has a visible SHAP value. At
first, that might look useful. But the name says the count happens after loan
approval. If the model is deciding whether to approve the loan, it cannot
honestly know the number of post-approval calls yet.

That is data leakage.

Data leakage means the model is using information that would not be available at
prediction time. A leaked feature can make a model look strong during testing
while making it useless or unsafe in real use.

When SHAP highlights a suspicious feature, do not celebrate immediately. Ask:

1. Was this feature available at the time of decision?
2. Is this feature a proxy for the answer we are trying to predict?
3. Would a human reviewer consider this reason legitimate?
4. Would the model still work if this feature were removed?

## 1.7 How To Read The Challenge Artifact

Open:

```text
labs/artifacts/loan_risk_casebook.json
```

The artifact has three important sections.

| Section | What to read |
|---|---|
| `global_summary` | Which features usually matter most |
| `local_cases` | Why one specific prediction happened |
| `known_trap` | A feature that teaches the data leakage warning |

For the global missions, sort by `mean_abs_shap`. For the local missions, look
inside one case and separate positive and negative SHAP values. For the leakage
mission, read the feature timing carefully.

## 1.8 Common Misunderstandings

**Misunderstanding 1: The biggest global feature explains every row.**

Not always. Global importance is an average. Local explanations can differ.

**Misunderstanding 2: Positive means good and negative means bad.**

No. Positive means "pushes the model output upward." You must know what the
model output represents.

**Misunderstanding 3: SHAP proves causality.**

No. SHAP explains the model's behavior. It does not prove that changing a
feature will cause the real world to change.

**Misunderstanding 4: If SHAP can explain it, the model is safe.**

No. A clear explanation can reveal an unsafe shortcut.

## 1.9 Review Questions

Before starting the SHAP missions, check whether you can answer these:

1. What is the difference between a feature and a prediction?
2. What does a positive SHAP value mean in the loan-risk artifact?
3. Why can a feature be globally important but locally unimportant?
4. Why is `post_approval_call_count` suspicious?
5. What should you write in plain English after reading SHAP values?

## Source

The official [SHAP documentation](https://shap.readthedocs.io/) describes SHAP
as a game-theoretic approach to explain machine-learning model output.
