import { theme, fontDisplay } from "../theme.js";
import { Screen, Slab, SlabHead, Hatch, Body, Foot, TextArea, Cta } from "../components/primitives.jsx";

export function TextPromptStep({ value, onChange, onBack, onNext, kicker, title, placeholder, buttonLabel }) {
  return (
    <Screen noBottomPad>
      <Slab>
        <Hatch />
        <SlabHead kicker={kicker} onBack={onBack} />
        <h2 style={{ fontFamily: fontDisplay, fontSize: 32, fontWeight: 700, textTransform: "uppercase", lineHeight: 1, marginTop: 18, position: "relative" }}>
          {title} <span style={{ color: theme.n400 }}>(optional)</span>
        </h2>
      </Slab>
      <Body>
        <TextArea autoFocus value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={6} />
      </Body>
      <Foot>
        <Cta onTap={onNext}>
          <span>{buttonLabel}</span>
        </Cta>
      </Foot>
    </Screen>
  );
}
