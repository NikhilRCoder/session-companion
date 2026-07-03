import { useState } from "react";
import { theme, fontSerif, fontSans } from "../theme.js";
import { getPeople, savePeople, makeId } from "../storage.js";
import { Screen, BackLink, Eyebrow, OptionButton, PrimaryButton } from "../components/primitives.jsx";

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
    <Screen>
      <BackLink onBack={onBack} />
      <div style={{ marginBottom: 22, textAlign: "center" }}>
        <span style={{ fontSize: 28, color: theme.sageDim, display: "block", marginBottom: 10 }}>◍</span>
        <Eyebrow>Before You Begin</Eyebrow>
        <h2 style={{ fontFamily: fontSerif, fontSize: 25, fontWeight: 600, color: theme.bone }}>Anyone with you?</h2>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {people.length === 0 && (
          <p style={{ fontFamily: fontSans, color: theme.faint, fontSize: 13.5, textAlign: "center", marginBottom: 16 }}>
            No one saved yet — add below, or skip if solo.
          </p>
        )}
        {people.map((person) => (
          <OptionButton
            key={person.id}
            label={person.name}
            selected={peopleIds.includes(person.id)}
            onTap={() => toggle(person.id)}
          />
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add a name..."
            style={{
              flex: 1,
              background: theme.bgCard,
              border: `1.5px solid ${theme.line}`,
              borderRadius: 14,
              padding: "13px 16px",
              color: theme.bone,
              fontSize: 15,
              fontFamily: fontSans,
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={addPerson}
            style={{
              background: theme.sage,
              color: theme.sageDeep,
              border: "none",
              borderRadius: 14,
              padding: "0 18px",
              fontFamily: fontSans,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      </div>
      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
        <PrimaryButton tone="sage" onTap={onNext}>
          {peopleIds.length > 0 ? "Continue" : "Continue Solo"}
        </PrimaryButton>
      </div>
    </Screen>
  );
}
