import { useState } from "react";
import { theme, fontDisplay, fontSans } from "../theme.js";
import { getPeople, savePeople, getSessions, makeId } from "../storage.js";
import { QUALITY_OPTIONS } from "../wizardSteps.js";
import { Screen, Slab, SlabHead, Body, SectionRule, Card, ProgressBar, Input } from "../components/primitives.jsx";

export function PeopleScreen() {
  const [people, setPeople] = useState(getPeople());
  const [sessions] = useState(getSessions());
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const addPerson = () => {
    if (!name.trim()) return;
    const updated = [...people, { id: makeId(), name: name.trim(), createdAt: new Date().toISOString() }];
    setPeople(updated);
    savePeople(updated);
    setName("");
  };
  const removePerson = (id) => {
    const updated = people.filter((p) => p.id !== id);
    setPeople(updated);
    savePeople(updated);
  };
  const renamePerson = (id, newName) => {
    const updated = people.map((p) => (p.id === id ? { ...p, name: newName } : p));
    setPeople(updated);
    savePeople(updated);
  };

  if (selected) {
    const withPerson = sessions.filter((s) => (s.peopleIds || []).includes(selected.id));
    const tally = Object.fromEntries(QUALITY_OPTIONS.map((q) => [q, 0]));
    withPerson.forEach((s) => {
      const q = s.interactionQuality?.[selected.id];
      if (q) tally[q]++;
    });
    const total = withPerson.length || 1;
    return (
      <Screen noBottomPad>
        <Slab>
          <SlabHead kicker="People" onBack={() => setSelected(null)} />
          <h2 style={{ fontFamily: fontDisplay, fontSize: 32, fontWeight: 700, textTransform: "uppercase", marginTop: 16, position: "relative" }}>
            {selected.name}
          </h2>
        </Slab>
        <Body>
          <Card>
            <SectionRule ink>Interaction quality</SectionRule>
            <div style={{ marginTop: 10 }}>
              {Object.entries(tally).map(([label, count]) => (
                <ProgressBar key={label} label={label} pct={(count / total) * 100} sub={`${count}`} />
              ))}
            </div>
          </Card>
          <Card>
            <SectionRule ink>Sessions together</SectionRule>
            <p style={{ fontFamily: fontDisplay, fontSize: 30, fontWeight: 700, color: theme.ink, marginTop: 6 }}>{withPerson.length}</p>
          </Card>
          {withPerson.length === 0 && (
            <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 13.5, textAlign: "center", marginTop: 20 }}>
              No sessions logged with {selected.name} yet.
            </p>
          )}
        </Body>
      </Screen>
    );
  }

  return (
    <Screen>
      <h2 style={{ fontFamily: fontDisplay, fontSize: 27, fontWeight: 700, textTransform: "uppercase", color: theme.ink, marginTop: 14, marginBottom: 18 }}>
        People
      </h2>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {people.length === 0 && (
          <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 13.5, textAlign: "center", marginBottom: 16 }}>No one saved yet.</p>
        )}
        {people.map((person) => (
          <Card key={person.id} style={{ display: "flex", flexDirection: "column" }}>
            {editingId === person.id ? (
              <Input
                defaultValue={person.name}
                autoFocus
                onBlur={(e) => {
                  renamePerson(person.id, e.target.value.trim() || person.name);
                  setEditingId(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
              />
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button onClick={() => setSelected(person)} style={{ background: "none", border: "none", textAlign: "left", flex: 1, cursor: "pointer" }}>
                  <span style={{ fontFamily: fontDisplay, color: theme.ink, fontSize: 15, fontWeight: 700, textTransform: "uppercase" }}>{person.name}</span>
                </button>
                <div style={{ display: "flex", gap: 14 }}>
                  <button onClick={() => setEditingId(person.id)} style={{ background: "none", border: "none", color: theme.n600, cursor: "pointer", fontSize: 13, fontFamily: fontSans }}>
                    Edit
                  </button>
                  <button onClick={() => removePerson(person.id)} style={{ background: "none", border: "none", color: theme.accent700, cursor: "pointer", fontSize: 13, fontFamily: fontSans }}>
                    Remove
                  </button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add a name..." style={{ flex: 1 }} />
        <button
          onClick={addPerson}
          style={{ background: theme.ink, color: theme.surface, border: "none", padding: "0 18px", fontFamily: fontDisplay, fontWeight: 700, fontSize: 13, textTransform: "uppercase", cursor: "pointer" }}
        >
          Add
        </button>
      </div>
    </Screen>
  );
}
