import { useState } from "react";
import { theme, fontSerif, fontSans } from "../theme.js";
import { getPeople, savePeople, getSessions, makeId } from "../storage.js";
import { Screen, BackLink, Eyebrow, Card, ProgressBar } from "../components/primitives.jsx";

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
    const tally = { "Felt good": 0, Neutral: 0, "Felt off": 0 };
    withPerson.forEach((s) => {
      const q = s.interactionQuality?.[selected.id];
      if (q) tally[q]++;
    });
    const total = withPerson.length || 1;
    return (
      <Screen>
        <BackLink onBack={() => setSelected(null)} label="← People" />
        <h2 style={{ fontFamily: fontSerif, fontSize: 27, fontWeight: 600, color: theme.bone, marginBottom: 18 }}>
          {selected.name}
        </h2>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <Card>
            <Eyebrow tone="rose">Interaction Quality</Eyebrow>
            <div style={{ marginTop: 10 }}>
              {Object.entries(tally).map(([label, count]) => (
                <ProgressBar key={label} label={label} pct={(count / total) * 100} sub={`${count}`} tone="rose" />
              ))}
            </div>
          </Card>
          <Card>
            <Eyebrow>Sessions Together</Eyebrow>
            <p style={{ fontFamily: fontSerif, fontSize: 30, color: theme.bone, marginTop: 6 }}>{withPerson.length}</p>
          </Card>
          {withPerson.length === 0 && (
            <p style={{ fontFamily: fontSans, color: theme.faint, fontSize: 13.5, textAlign: "center", marginTop: 20 }}>
              No sessions logged with {selected.name} yet.
            </p>
          )}
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <h2 style={{ fontFamily: fontSerif, fontSize: 27, fontWeight: 600, color: theme.bone, marginTop: 14, marginBottom: 18 }}>
        People
      </h2>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {people.length === 0 && (
          <p style={{ fontFamily: fontSans, color: theme.faint, fontSize: 13.5, textAlign: "center", marginBottom: 16 }}>
            No one saved yet.
          </p>
        )}
        {people.map((person) => (
          <Card key={person.id} style={{ display: "flex", flexDirection: "column" }}>
            {editingId === person.id ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  defaultValue={person.name}
                  autoFocus
                  onBlur={(e) => {
                    renamePerson(person.id, e.target.value.trim() || person.name);
                    setEditingId(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
                  style={{
                    flex: 1,
                    background: theme.bgRaised,
                    border: `1px solid ${theme.line}`,
                    borderRadius: 10,
                    padding: "8px 12px",
                    color: theme.bone,
                    fontFamily: fontSans,
                    fontSize: 14,
                  }}
                />
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  onClick={() => setSelected(person)}
                  style={{ background: "none", border: "none", textAlign: "left", flex: 1, cursor: "pointer" }}
                >
                  <span style={{ fontFamily: fontSans, color: theme.bone, fontSize: 15, fontWeight: 700 }}>
                    {person.name}
                  </span>
                </button>
                <div style={{ display: "flex", gap: 14 }}>
                  <button
                    onClick={() => setEditingId(person.id)}
                    style={{ background: "none", border: "none", color: theme.faint, cursor: "pointer", fontSize: 13 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removePerson(person.id)}
                    style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", fontSize: 13 }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
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
    </Screen>
  );
}
