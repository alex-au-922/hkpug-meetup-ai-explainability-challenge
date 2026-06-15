# SHAP For Humans

SHAP is a way to explain a model prediction.

If the model says:

> This loan applicant is high risk.

SHAP helps you answer:

> Which facts pushed the model toward high risk, and which facts pushed it back
> down?

## The Restaurant Bill Mental Model

Imagine four friends share a dinner bill.

The total bill is the model prediction. The friends are the features. SHAP asks:

> How much did each friend contribute to the final bill?

For a model, the "friends" are things like:

- late payments
- credit utilization
- income stability
- employment history

Each feature gets a contribution.

## Positive And Negative SHAP Values

For this challenge:

| SHAP sign | Meaning |
|---|---|
| Positive value | Pushes risk up |
| Negative value | Pushes risk down |
| Near zero | Barely matters for this prediction |

Example:

```text
base risk: 0.32
late_payments: +0.24
credit_utilization: +0.18
stable_income: -0.09
employment_months: -0.06
final risk: about 0.59
```

Read it as:

> The model started around 0.32. Late payments and credit utilization pushed the
> score up. Stable income and employment history pushed it down. The up-push won.

## Global vs Local

Global SHAP asks:

> Across many rows, which features usually matter most?

Local SHAP asks:

> For this one row, why did the model make this one prediction?

Do not mix them up. A feature can be globally important but not matter much for
one specific person.

## The Big Trap

SHAP can tell you what the model used. It does not automatically tell you
whether the model should have used it.

If a feature is only known after the decision, it can be data leakage.

Example:

```text
post_approval_call_count
```

If the model is making an approval decision, it cannot honestly know what
happens after approval. A high SHAP value on that feature is not a miracle. It
is a warning light.

## Beginner Checklist

When you read a SHAP artifact, ask:

1. What is the model predicting?
2. What is the base score?
3. Which features push the score up?
4. Which features push the score down?
5. Is any feature suspicious because it would not be known at decision time?

## Source

The official [SHAP documentation](https://shap.readthedocs.io/) describes SHAP
as a game-theoretic approach to explain machine-learning model output.
