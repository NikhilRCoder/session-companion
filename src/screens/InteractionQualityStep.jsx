import { theme, fontDisplay } from "../theme.js";
import { getPeople } from "../storage.js";
import { QUALITY_OPTIONS } from "../wizardSteps.js";
import { Screen, Slab, SlabHead, Hatch, Body, Foot, Card, SectionRule, Wrap, Chip, Cta } from "../components/primitives.jsx";
import { Arrow } from "../components/icons.jsx";

export function InteractionQualityStep({ peopleIds, quality, setQuality, onBack, onNext }) {
  const people = getPeople().filter((p) => peopleIds.includes(p.id));
  const allAnswered = people.every((p) => quality[p.id]);

  return (
    <Screen noBottomPad>
      <Slab>
        <Hatch />
        <SlabHead kicker="Debrief" onBack={onBack} />
        <h2 style={{ fontFamily: fontDisplay, fontSize: 32, fontWeight: 700, textTransform: "uppercase", lineHeight: 1, marginTop: 18, position: "relative" }}>
          How did it feel
          <br />
          with each person?
        </h2>
      </Slab>
      <Body>
        {people.map((person) => (
          <Card key={person.id} style={{ marginBottom: 0 }}>
            <SectionRule ink>{person.name}</SectionRule>
            <Wrap>
              {QUALITY_OPTIONS.map((option) => (
                <Chip key={option} label={option} size="sm" selected={quality[person.id] === option} onTap={() => setQuality({ ...quality, [person.id]: option })} />
              ))}
            </Wrap>
          </Card>
        ))}
      </Body>
      <Foot>
        <Cta onTap={onNext} disabled={!allAnswered}>
          <span>Continue</span>
          <Arrow />
        </Cta>
      </Foot>
    </Screen>
  );
}
