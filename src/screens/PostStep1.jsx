import { theme, fontDisplay, fontSans } from "../theme.js";
import { SCALE, EFFECTS, MET } from "../wizardSteps.js";
import { formatDuration } from "../format.js";
import { Screen, Slab, SlabHead, Hatch, Body, Foot, SectionRule, Wrap, Chip, Cta } from "../components/primitives.jsx";
import { Arrow } from "../components/icons.jsx";

export function PostStep1({ answers, setAnswers, finalSeconds, onBack, onNext }) {
  const set = (key, value) => setAnswers({ ...answers, [key]: value });
  const toggle = (key, value) => {
    const current = answers[key] || [];
    set(key, current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  };

  return (
    <Screen noBottomPad>
      <Slab>
        <Hatch />
        <SlabHead kicker="Debrief" step={["01", "02"]} onBack={onBack} />
        <h2 style={{ fontFamily: fontDisplay, fontSize: 36, fontWeight: 700, textTransform: "uppercase", lineHeight: 0.95, marginTop: 16, position: "relative" }}>
          How did
          <br />
          it go?
        </h2>
        <div style={{ position: "relative", marginTop: 12, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: theme.n400, fontFamily: fontSans }}>
          Ran {formatDuration(finalSeconds * 1000)}
        </div>
      </Slab>
      <Body>
        <div>
          <SectionRule hint="1 poor / 5 great">Overall</SectionRule>
          <div style={{ display: "flex", gap: 8 }}>
            {SCALE.map((opt) => (
              <Chip key={opt} label={opt} size="grow" selected={answers.rating === opt} onTap={() => set("rating", opt)} />
            ))}
          </div>
        </div>
        <div>
          <SectionRule>Effects felt</SectionRule>
          <Wrap>
            {EFFECTS.map((opt) => (
              <Chip key={opt} label={opt} selected={(answers.effects || []).includes(opt)} onTap={() => toggle("effects", opt)} />
            ))}
          </Wrap>
        </div>
        <div>
          <SectionRule>Met the intention?</SectionRule>
          <div style={{ display: "flex", gap: 8 }}>
            {MET.map((opt) => (
              <Chip key={opt} label={opt} size="grow" selected={answers.metIntention === opt} onTap={() => set("metIntention", opt)} />
            ))}
          </div>
        </div>
      </Body>
      <Foot>
        <Cta onTap={onNext} disabled={!answers.rating}>
          <span>Continue</span>
          <Arrow />
        </Cta>
      </Foot>
    </Screen>
  );
}
