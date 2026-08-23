import { useState } from "react";
import { theme, fontSans } from "../theme.js";
import { getFields, saveFields, makeId } from "../storage.js";
import { Card, SectionRule, Wrap, Chip, Input, Cta } from "../components/primitives.jsx";

const TYPE_LABELS = { text: "Text", number: "Number", choice: "Choice", yesno: "Yes / No" };
const PHASE_LABELS = { pre: "Before session", post: "After session" };

export function CustomFieldsCard() {
  const [fields, setFields] = useState(getFields());
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [type, setType] = useState("text");
  const [phase, setPhase] = useState("post");
  const [optionsInput, setOptionsInput] = useState("");
  const [error, setError] = useState("");

  const removeField = (id) => {
    const updated = fields.filter((f) => f.id !== id);
    setFields(updated);
    saveFields(updated);
  };

  const addField = () => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) {
      setError("Give the field a name.");
      return;
    }
    let options;
    if (type === "choice") {
      options = [...new Set(optionsInput.split(",").map((s) => s.trim()).filter(Boolean))];
      if (options.length < 2) {
        setError("Choice fields need at least 2 options, comma-separated.");
        return;
      }
    }
    const field = { id: makeId(), label: trimmedLabel, type, ...(options ? { options } : {}), phase, createdAt: new Date().toISOString() };
    const updated = [...fields, field];
    setFields(updated);
    saveFields(updated);
    setLabel("");
    setType("text");
    setPhase("post");
    setOptionsInput("");
    setError("");
    setAdding(false);
  };

  return (
    <Card>
      <SectionRule ink>Custom Fields</SectionRule>
      <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 13.5, marginTop: 6, marginBottom: 14, lineHeight: 1.6 }}>
        Add your own questions to the pre- or post-session check-in. They're always optional to answer.
      </p>
      {fields.length === 0 ? (
        <p style={{ fontFamily: fontSans, color: theme.n500, fontSize: 13, marginBottom: 12 }}>None yet.</p>
      ) : (
        <div style={{ marginBottom: 12 }}>
          {fields.map((field) => (
            <div key={field.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
              <div>
                <span style={{ fontFamily: fontSans, color: theme.ink, fontSize: 14 }}>{field.label}</span>
                <span style={{ fontFamily: fontSans, color: theme.n500, fontSize: 12, marginLeft: 8 }}>
                  {PHASE_LABELS[field.phase]} · {TYPE_LABELS[field.type]}
                </span>
              </div>
              <button onClick={() => removeField(field.id)} style={{ background: "none", border: "none", color: theme.accent700, cursor: "pointer", fontSize: 13, fontFamily: fontSans }}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      {adding ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Field name (e.g. Music playing?)" />
          <div>
            <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 12, marginBottom: 6 }}>Asked</p>
            <Wrap>
              {Object.entries(PHASE_LABELS).map(([value, text]) => (
                <Chip key={value} label={text} size="sm" selected={phase === value} onTap={() => setPhase(value)} />
              ))}
            </Wrap>
          </div>
          <div>
            <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 12, marginBottom: 6 }}>Type</p>
            <Wrap>
              {Object.entries(TYPE_LABELS).map(([value, text]) => (
                <Chip key={value} label={text} size="sm" selected={type === value} onTap={() => setType(value)} />
              ))}
            </Wrap>
          </div>
          {type === "choice" && (
            <Input value={optionsInput} onChange={(e) => setOptionsInput(e.target.value)} placeholder="Options, comma-separated (e.g. Low, Medium, High)" />
          )}
          {error && <p style={{ fontFamily: fontSans, fontSize: 12.5, color: theme.accent700 }}>{error}</p>}
          <div style={{ display: "flex", gap: 10 }}>
            <Cta tone="ghost" onTap={() => { setAdding(false); setError(""); }} style={{ flex: 1, justifyContent: "center" }}>
              <span>Cancel</span>
            </Cta>
            <Cta onTap={addField} style={{ flex: 1, justifyContent: "center" }}>
              <span>Save Field</span>
            </Cta>
          </div>
        </div>
      ) : (
        <Cta tone="ghost" onTap={() => setAdding(true)}>
          <span>Add Field</span>
        </Cta>
      )}
    </Card>
  );
}
