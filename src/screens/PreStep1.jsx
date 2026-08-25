import { theme, fontDisplay, fontSans } from "../theme.js";
import { INTENTIONS, METHODS } from "../wizardSteps.js";
import { daysSince } from "../format.js";
import { Screen, Slab, SlabHead, Hatch, Body, Foot, SectionRule, Wrap, Chip, Input, Card, Cta } from "../components/primitives.jsx";
import { Arrow } from "../components/icons.jsx";

export function PreStep1({ answers, setAnswers, breakState, onBack, onNext }) {
  const set = (key, value) => setAnswers({ ...answers, [key]: value });
  const invalid = !(answers.intention && answers.method);

  return (
    <Screen noBottomPad>
      <Slab>
        <Hatch />
        <SlabHead kicker="Pre-session" step={["01", "02"]} onBack={onBack} />
        <h2 style={{ fontFamily: fontDisplay, fontSize: 36, fontWeight: 700, textTransform: "uppercase", lineHeight: 0.95, marginTop: 18, position: "relative" }}>
          What's
          <br />
          the plan?
        </h2>
      </Slab>
      <Body>
        {breakState && (
          <Card style={{ borderColor: theme.accent, marginBottom: 0 }}>
            <p style={{ fontFamily: fontSans, color: theme.accent700, fontSize: 13.5, fontWeight: 600, lineHeight: 1.5 }}>
              Day {daysSince(breakState.startedAt)} since your last session. You may be more sensitive than usual — consider starting with a lower dose.
            </p>
          </Card>
        )}
        <div>
          <SectionRule>Intention</SectionRule>
          <Wrap>
            {INTENTIONS.map((opt) => (
              <Chip key={opt} label={opt} selected={answers.intention === opt} onTap={() => set("intention", opt)} />
            ))}
          </Wrap>
        </div>
        <div>
          <SectionRule>Method</SectionRule>
          <Wrap>
            {METHODS.map((opt) => (
              <Chip key={opt} label={opt} selected={answers.method === opt} onTap={() => set("method", opt)} />
            ))}
          </Wrap>
        </div>
        <div>
          <SectionRule>Strain / product</SectionRule>
          <Input
            placeholder="e.g. Blue Dream"
            value={answers.strain || ""}
            onChange={(e) => set("strain", e.target.value)}
          />
        </div>
        <div>
          <SectionRule>Dose</SectionRule>
          <div style={{ display: "flex", gap: 8 }}>
            <Input
              style={{ flex: 1, minWidth: 0, fontFamily: fontDisplay, fontWeight: 700, fontSize: 17 }}
              inputMode="decimal"
              placeholder="0.3"
              value={answers.dose || ""}
              onChange={(e) => set("dose", e.target.value)}
            />
            {["mg", "g"].map((u) => (
              <Chip key={u} label={u} selected={(answers.doseUnit || "mg") === u} onTap={() => set("doseUnit", u)} style={{ padding: "12px 16px", fontSize: 14 }} />
            ))}
          </div>
        </div>
      </Body>
      <Foot>
        <Cta onTap={onNext} disabled={invalid}>
          <span>Continue</span>
          <Arrow />
        </Cta>
      </Foot>
    </Screen>
  );
}
