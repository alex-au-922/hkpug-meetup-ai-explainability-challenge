# Mission 04: Audit A Feature For Decision-Time Leakage

## Learning Objective

This mission teaches a critical warning: explanation is not the same thing as
approval. SHAP can show that a feature influenced the model, but humans still
need to decide whether that feature is valid and safe to use.

## Artifact

```text
labs/artifacts/loan_risk_casebook.json
```

Open:

```text
known_trap
```

## Background

SHAP can reveal that a feature matters. It cannot bless the feature as fair,
legal, causal, or available.

If a model uses a feature that only exists after the decision, it is probably
peeking into the future.

This is called data leakage. Data leakage often makes a model look better during
testing than it will be in real life. The model is effectively using information
that would not exist when the prediction is supposed to happen.

## Mini Lesson

Data leakage is one of the most important failure modes in applied machine
learning. It happens when training or evaluation data contains information that
will not be available when the model is used for real.

Leakage can be subtle. Sometimes the feature name gives it away. Sometimes the
feature is created by a pipeline step that accidentally uses future rows.
Sometimes a column is a disguised version of the target label.

SHAP is helpful here because it can reveal that the model is relying on a
suspicious feature. But SHAP does not decide whether the feature is legitimate.
Humans still need to ask whether the feature belongs in the model.

## Study Note

A good model review asks two questions at the same time:

1. What did the model use?
2. Should the model have been allowed to use it?

SHAP is very good at the first question. It can show that
`post_approval_call_count` influenced the score. The second question requires
domain reasoning. If the feature is only created after the approval decision,
then it would not be available at the moment the model is supposed to make the
prediction.

This is why explanation tools do not replace judgment. They make judgment
better informed. A feature can be highly predictive and still be invalid for
deployment. In fact, leaked features often look extremely predictive because
they contain information from the future.

## Guided Reading

Open the `known_trap` section. Read the feature name, the trap type, and the
explanation of why the feature is bad. Your answer should connect the timing
problem to the phrase "data leakage" or "future data."

## Worked Reading

The artifact tells you that `post_approval_call_count` is only known after a
loan decision. That timing is the key. A model used during approval cannot use
facts from after approval.

A good reasoning chain is:

1. The model is supposed to help with an approval-time decision.
2. `post_approval_call_count` is created after approval.
3. Therefore the feature would not exist at decision time.
4. Using it would be data leakage.

## Common Mistakes

Do not say the feature is suspicious only because it has a high SHAP value. A
high SHAP value tells you the model uses it. The timing tells you why it is bad.

Do not say "correlation" when the issue is availability. The main problem here
is not merely that the feature is correlated. The problem is that it is future
information.

Do not propose "keep it because it improves score." Leakage can improve a test
score while making the model invalid.

## Scored Questions

A complete answer does five things:

1. Rejects the feature that fails the timing test.
2. Names the trap type.
3. Explains the availability test in plain English.
4. Names a comparison feature that is available before the decision.
5. Proposes a mitigation plan that would make the model review actionable.

## Submit

```json
{
  "participant_id": "AIEX-YOUR-TEAM",
  "mission_id": "mission-04",
  "answer": {
    "rejected_feature": "feature_name_here",
    "trap_type": "trap_name_here",
    "availability_test": "how you know whether the feature is available at decision time",
    "safe_comparison_feature": "one feature that can be known before the decision",
    "mitigation": "what should the team do next?"
  },
  "evidence": [
    "Explain the future-data problem using the artifact."
  ]
}
```

## Beginner Translation

If you only know the fact after the answer, the model was cheating.
