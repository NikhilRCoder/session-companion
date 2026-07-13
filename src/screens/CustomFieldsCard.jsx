import { useState } from "react";
import { theme, fontSans } from "../theme.js";
import { getFields, saveFields, makeId } from "../storage.js";
import { Eyebrow, Card, PrimaryButton, ChoiceChip } from "../components/primitives.jsx";

const TYPE_LABELS = { text: "Text", number: "Number", choice: "Choice", yesno: "Yes / No" };
const PHASE_LABELS = { pre: "Before session", post: "After session" };

const inputStyle = {
  width: "100%",
  background: theme.bgCard,
  border: `1.5px solid ${theme.line}`,
  borderRadius: 14,
  padding: "13px 16px",
  color: theme.bone,
  fontSize: 15,
  fontFamily: fontSans,
  boxSizing: "border-box",
};

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
    const field = {
      id: makeId(),
      label: trimmedLabel,
      type,
      ...(options ? { options } : {}),
      phase,
      createdAt: new Date().toISOString(),
    };
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
      <Eyebrow>Custom Fields</Eyebrow>
      <p style={{ fontFamily: fontSans, color: theme.fade, fontSize: 13.5, marginTop: 6, marginBottom: 14, lineHeight: 1.6 }}>
        Add your own questions to the pre- or post-session check-in. They're always optional to answer.
      </p>
      {fields.length === 0 ? (
        <p style={{ fontFamily: fontSans, color: theme.faint, fontSize: 13, marginBottom: 12 }}>None yet.</p>
      ) : (
        <div style={{ marginBottom: 12 }}>
          {fields.map((field) => (
            <div key={field.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
              <div>
                <span style={{ fontFamily: fontSans, color: theme.bone, fontSize: 14 }}>{field.label}</span>
                <span style={{ fontFamily: fontSans, color: theme.faint, fontSize: 12, marginLeft: 8 }}>
                  {PHASE_LABELS[field.phase]} · {TYPE_LABELS[field.type]}
                </span>
              </div>
              <button
                onClick={() => removeField(field.id)}
                style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", fontSize: 13 }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      {adding ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Field name (e.g. Music playing?)"
            style={inputStyle}
          />
          <div>
            <p style={{ fontFamily: fontSans, color: theme.faint, fontSize: 12, marginBottom: 6 }}>Asked</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(PHASE_LABELS).map(([value, text]) => (
                <ChoiceChip key={value} label={text} selected={phase === value} onTap={() => setPhase(value)} tone="sage" />
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontFamily: fontSans, color: theme.faint, fontSize: 12, marginBottom: 6 }}>Type</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(TYPE_LABELS).map(([value, text]) => (
                <ChoiceChip key={value} label={text} selected={type === value} onTap={() => setType(value)} tone="sage" />
              ))}
            </div>
          </div>
          {type === "choice" && (
            <input
              value={optionsInput}
              onChange={(e) => setOptionsInput(e.target.value)}
              placeholder="Options, comma-separated (e.g. Low, Medium, High)"
              style={inputStyle}
            />
          )}
          {error && (
            <p style={{ fontFamily: fontSans, fontSize: 12.5, color: theme.danger }}>{error}</p>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <PrimaryButton tone="ghost" onTap={() => { setAdding(false); setError(""); }} style={{ flex: 1 }}>
              Cancel
            </PrimaryButton>
            <PrimaryButton tone="sage" onTap={addField} style={{ flex: 1 }}>
              Save Field
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <PrimaryButton tone="ghost" onTap={() => setAdding(true)}>
          Add Field
        </PrimaryButton>
      )}
    </Card>
  );
}
