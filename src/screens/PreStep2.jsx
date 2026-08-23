import { fontDisplay } from "../theme.js";
import { TOLERANCE, SCALE, ENVIRONMENTS, PHYSICAL } from "../wizardSteps.js";
import { fieldsFor } from "../customFields.js";
import { Screen, Slab, SlabHead, Hatch, Body, Foot, SectionRule, Wrap, Chip, Cta } from "../components/primitives.jsx";
import { CustomFieldGroup } from "../components/CustomFieldGroup.jsx";
import { Arrow } from "../components/icons.jsx";

export function PreStep2({ answers, setAnswers, onBack, onNext }) {
  const set = (key, value) => setAnswers({ ...answers, [key]: value });
  const toggle = (key, value) => {
    const current = answers[key] || [];
    set(key, current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  };
  const invalid = !(answers.tolerance && answers.baselineMood && answers.environment);
  const customFields = fieldsFor("pre");

  return (
    <Screen noBottomPad>
      <Slab>
        <Hatch />
        <SlabHead kicker="Pre-session" step={["02", "02"]} onBack={onBack} />
        <h2 style={{ fontFamily: fontDisplay, fontSize: 36, fontWeight: 700, textTransform: "uppercase", lineHeight: 0.95, marginTop: 18, position: "relative" }}>
          Baseline
          <br />
          check
        </h2>
      </Slab>
      <Body>
        <div>
          <SectionRule>Tolerance</SectionRule>
          <Wrap>
            {TOLERANCE.map((opt) => (
              <Chip key={opt} label={opt} selected={answers.tolerance === opt} onTap={() => set("tolerance", opt)} />
            ))}
          </Wrap>
        </div>
        <div>
          <SectionRule hint="1 low / 5 great">Baseline mood</SectionRule>
          <div style={{ display: "flex", gap: 8 }}>
            {SCALE.map((opt) => (
              <Chip key={opt} label={opt} size="grow" selected={answers.baselineMood === opt} onTap={() => set("baselineMood", opt)} />
            ))}
          </div>
        </div>
        <div>
          <SectionRule>Environment</SectionRule>
          <Wrap>
            {ENVIRONMENTS.map((opt) => (
              <Chip key={opt} label={opt} selected={answers.environment === opt} onTap={() => set("environment", opt)} />
            ))}
          </Wrap>
        </div>
        <div>
          <SectionRule hint="Any">Physical state</SectionRule>
          <Wrap>
            {PHYSICAL.map((opt) => (
              <Chip key={opt} label={opt} selected={(answers.physical || []).includes(opt)} onTap={() => toggle("physical", opt)} />
            ))}
          </Wrap>
        </div>
        <CustomFieldGroup fields={customFields} answers={answers} setAnswers={setAnswers} />
      </Body>
      <Foot>
        <Cta onTap={onNext} disabled={invalid}>
          <span>Begin session</span>
          <Arrow />
        </Cta>
      </Foot>
    </Screen>
  );
}
