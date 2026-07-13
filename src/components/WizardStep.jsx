import { theme, fontSerif, fontSans } from "../theme.js";
import { Screen, BackLink, StepDots, Eyebrow, OptionButton, PrimaryButton, TextArea } from "./primitives.jsx";

export function WizardStep({
  steps,
  answers,
  setAnswers,
  stepIndex,
  setStepIndex,
  onFinish,
  onExitBack,
  finishLabel,
  eyebrow,
  tone = "sage",
}) {
  const step = steps[stepIndex];
  const currentAnswer = answers[step.key];
  const isMulti = !!step.multi;
  const isSelected = (option) => (isMulti ? (currentAnswer || []).includes(option) : currentAnswer === option);
  const toggle = (option) => {
    if (isMulti) {
      const selected = currentAnswer || [];
      setAnswers({
        ...answers,
        [step.key]: selected.includes(option) ? selected.filter((o) => o !== option) : [...selected, option],
      });
    } else {
      setAnswers({ ...answers, [step.key]: option });
    }
  };
  const canAdvance = step.optional ? true : isMulti ? (currentAnswer || []).length > 0 : !!currentAnswer;
  const isLastStep = stepIndex === steps.length - 1;
  const advance = () => (isLastStep ? onFinish() : setStepIndex(stepIndex + 1));

  return (
    <Screen>
      <BackLink onBack={() => (stepIndex === 0 ? onExitBack?.() : setStepIndex(stepIndex - 1))} />
      <StepDots total={steps.length} index={stepIndex} />
      <div style={{ marginBottom: 26, textAlign: "center" }}>
        <span
          style={{
            fontSize: 28,
            color: tone === "rose" ? theme.roseDim : theme.sageDim,
            display: "block",
            marginBottom: 10,
          }}
        >
          {step.icon}
        </span>
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        <h2 style={{ fontFamily: fontSerif, fontSize: 25, fontWeight: 600, color: theme.bone, lineHeight: 1.25 }}>
          {step.q}
          {step.optional && (
            <>
              {" "}
              <span style={{ color: theme.faint, fontSize: 15, fontFamily: fontSans }}>(optional)</span>
            </>
          )}
        </h2>
      </div>
      <div style={{ flex: 1 }}>
        {step.input === "text" ? (
          <TextArea
            value={currentAnswer || ""}
            onChange={(e) => setAnswers({ ...answers, [step.key]: e.target.value })}
            rows={4}
          />
        ) : step.input === "number" ? (
          <input
            value={currentAnswer || ""}
            onChange={(e) => setAnswers({ ...answers, [step.key]: e.target.value })}
            type="number"
            inputMode="decimal"
            step="0.01"
            style={{
              width: "100%",
              background: theme.bgCard,
              border: `1.5px solid ${theme.line}`,
              borderRadius: 16,
              padding: "16px 18px",
              color: theme.bone,
              fontSize: 16,
              fontFamily: fontSans,
              boxSizing: "border-box",
            }}
          />
        ) : (
          (step.options || []).map((option) => (
            <OptionButton key={option} label={option} selected={isSelected(option)} onTap={() => toggle(option)} tone={tone} />
          ))
        )}
      </div>
      <div style={{ marginTop: 18 }}>
        <PrimaryButton tone={tone} disabled={!canAdvance} onTap={advance}>
          {isLastStep ? finishLabel : "Continue"}
        </PrimaryButton>
      </div>
    </Screen>
  );
}
