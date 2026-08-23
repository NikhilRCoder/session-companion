import { useState } from "react";
import { theme, fontDisplay, fontSans } from "../theme.js";
import { getPeople, savePeople, makeId } from "../storage.js";
import { Screen, Slab, SlabHead, Hatch, Body, Foot, SectionRule, Wrap, Chip, Input, Cta } from "../components/primitives.jsx";
import { Arrow } from "../components/icons.jsx";

export function PeoplePickerStep({ peopleIds, setPeopleIds, onBack, onNext }) {
  const [people, setPeople] = useState(getPeople());
  const [name, setName] = useState("");

  const toggle = (id) => setPeopleIds(peopleIds.includes(id) ? peopleIds.filter((p) => p !== id) : [...peopleIds, id]);

  const addPerson = () => {
    if (!name.trim()) return;
    const person = { id: makeId(), name: name.trim(), createdAt: new Date().toISOString() };
    const updated = [...people, person];
    setPeople(updated);
    savePeople(updated);
    setPeopleIds([...peopleIds, person.id]);
    setName("");
  };

  return (
    <Screen noBottomPad>
      <Slab>
        <Hatch />
        <SlabHead kicker="Pre-session" onBack={onBack} />
        <h2 style={{ fontFamily: fontDisplay, fontSize: 36, fontWeight: 700, textTransform: "uppercase", lineHeight: 0.95, marginTop: 18, position: "relative" }}>
          Anyone
          <br />
          with you?
        </h2>
      </Slab>
      <Body>
        <div>
          {people.length === 0 && (
            <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 13.5, marginBottom: 14 }}>
              No one saved yet — add below, or skip if solo.
            </p>
          )}
          <Wrap>
            {people.map((person) => (
              <Chip key={person.id} label={person.name} selected={peopleIds.includes(person.id)} onTap={() => toggle(person.id)} />
            ))}
          </Wrap>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add a name..." style={{ flex: 1 }} />
            <button
              onClick={addPerson}
              style={{
                background: theme.ink,
                color: theme.surface,
                border: "none",
                padding: "0 18px",
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: 13,
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>
        </div>
      </Body>
      <Foot>
        <Cta onTap={onNext}>
          <span>{peopleIds.length > 0 ? "Continue" : "Continue Solo"}</span>
          <Arrow />
        </Cta>
      </Foot>
    </Screen>
  );
}
