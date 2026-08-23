import { fontDisplay } from "../theme.js";
import { SYMPTOMS, REPEAT } from "../wizardSteps.js";
import { fieldsFor } from "../customFields.js";
import { Screen, Slab, SlabHead, Hatch, Body, Foot, SectionRule, Wrap, Chip, TextArea, Cta } from "../components/primitives.jsx";
import { CustomFieldGroup } from "../components/CustomFieldGroup.jsx";
import { Arrow } from "../components/icons.jsx";

export function PostStep2({ answers, setAnswers, onBack, onNext }) {
  const set = (key, value) => setAnswers({ ...answers, [key]: value });
  const toggle = (key, value) => {
    const current = answers[key] || [];
    set(key, current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  };
  const customFields = fieldsFor("post");

  return (
    <Screen noBottomPad>
      <Slab>
        <Hatch />
        <SlabHead kicker="Debrief" step={["02", "02"]} onBack={onBack} />
        <h2 style={{ fontFamily: fontDisplay, fontSize: 36, fontWeight: 700, textTransform: "uppercase", lineHeight: 0.95, marginTop: 18, position: "relative" }}>
          The
          <br />
          aftermath
        </h2>
      </Slab>
      <Body>
        <div>
          <SectionRule>Side effects</SectionRule>
          <Wrap>
            {SYMPTOMS.map((opt) => (
              <Chip key={opt} label={opt} selected={(answers.sideEffects || []).includes(opt)} onTap={() => toggle("sideEffects", opt)} />
            ))}
          </Wrap>
        </div>
        <div>
          <SectionRule>Comedown</SectionRule>
          <TextArea
            rows={3}
            placeholder="How long did it feel like it lasted? Any comedown?"
            value={answers.comedownNotes || ""}
            onChange={(e) => set("comedownNotes", e.target.value)}
          />
        </div>
        <div>
          <SectionRule>Repeat this?</SectionRule>
          <div style={{ display: "flex", gap: 8 }}>
            {REPEAT.map((opt) => (
              <Chip key={opt} label={opt} size="grow" selected={answers.repeat === opt} onTap={() => set("repeat", opt)} />
            ))}
          </div>
        </div>
        <CustomFieldGroup fields={customFields} answers={answers} setAnswers={setAnswers} />
      </Body>
      <Foot>
        <Cta onTap={onNext} disabled={!answers.repeat}>
          <span>Finish</span>
          <Arrow />
        </Cta>
      </Foot>
    </Screen>
  );
}
