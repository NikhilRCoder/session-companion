import { theme, fontSerif, fontSans } from "../theme.js";
import { Screen, BackLink, Eyebrow, TextArea, PrimaryButton } from "../components/primitives.jsx";

export function TextPromptStep({ value, onChange, onBack, onNext, icon, eyebrow, title, placeholder, buttonLabel, tone = "sage" }) {
  return (
    <Screen>
      <BackLink onBack={onBack} />
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <span
          style={{
            fontSize: 28,
            color: tone === "rose" ? theme.roseDim : theme.sageDim,
            display: "block",
            marginBottom: 10,
          }}
        >
          {icon}
        </span>
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        <h2 style={{ fontFamily: fontSerif, fontSize: 25, fontWeight: 600, color: theme.bone }}>
          {title} <span style={{ color: theme.faint, fontSize: 15, fontFamily: fontSans }}>(optional)</span>
        </h2>
      </div>
      <TextArea
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        style={{ marginBottom: 20 }}
      />
      <div style={{ marginTop: "auto" }}>
        <PrimaryButton tone={tone} onTap={onNext}>
          {buttonLabel}
        </PrimaryButton>
      </div>
    </Screen>
  );
}
