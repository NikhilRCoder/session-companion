import { theme, fontSerif, fontSans } from "../theme.js";
import { getPeople, vibrate } from "../storage.js";
import { QUALITY_OPTIONS } from "../wizardSteps.js";
import { Screen, BackLink, Eyebrow, Card, PrimaryButton } from "../components/primitives.jsx";

export function InteractionQualityStep({ peopleIds, quality, setQuality, onBack, onNext }) {
  const people = getPeople().filter((p) => peopleIds.includes(p.id));
  const allAnswered = people.every((p) => quality[p.id]);

  return (
    <Screen>
      <BackLink onBack={onBack} />
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <span style={{ fontSize: 28, color: theme.roseDim, display: "block", marginBottom: 10 }}>◍</span>
        <Eyebrow tone="rose">Checking In</Eyebrow>
        <h2 style={{ fontFamily: fontSerif, fontSize: 25, fontWeight: 600, color: theme.bone }}>
          How did it feel with each person?
        </h2>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {people.map((person) => (
          <Card key={person.id}>
            <p style={{ fontFamily: fontSans, color: theme.bone, fontSize: 15, fontWeight: 700, marginBottom: 10 }}>
              {person.name}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {QUALITY_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    vibrate();
                    setQuality({ ...quality, [person.id]: option });
                  }}
                  style={{
                    padding: "9px 14px",
                    borderRadius: 999,
                    fontFamily: fontSans,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: quality[person.id] === option ? `1.5px solid ${theme.rose}` : `1.5px solid ${theme.line}`,
                    background: quality[person.id] === option ? `${theme.rose}1a` : "transparent",
                    color: quality[person.id] === option ? theme.rose : theme.fade,
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <div style={{ marginTop: 18 }}>
        <PrimaryButton tone="rose" disabled={!allAnswered} onTap={onNext}>
          Continue
        </PrimaryButton>
      </div>
    </Screen>
  );
}
