import { SectionRule, Wrap, Chip, Input, TextArea } from "./primitives.jsx";

// Renders a phase's user-defined custom fields as additional sections at the
// end of a grouped wizard screen, writing into the same `answers` dict as
// the built-in fields (keyed by field.id).
export function CustomFieldGroup({ fields, answers, setAnswers }) {
  if (!fields.length) return null;
  return (
    <>
      {fields.map((field) => {
        const value = answers[field.id];
        const set = (v) => setAnswers({ ...answers, [field.id]: v });
        return (
          <div key={field.id}>
            <SectionRule hint="Optional">{field.label}</SectionRule>
            {field.type === "choice" || field.type === "yesno" ? (
              <Wrap>
                {(field.type === "yesno" ? ["Yes", "No"] : field.options || []).map((opt) => (
                  <Chip key={opt} label={opt} selected={value === opt} onTap={() => set(opt)} />
                ))}
              </Wrap>
            ) : field.type === "number" ? (
              <Input
                value={value ?? ""}
                onChange={(e) => set(e.target.value)}
                type="number"
                inputMode="decimal"
                step="0.01"
              />
            ) : (
              <TextArea value={value || ""} onChange={(e) => set(e.target.value)} rows={3} />
            )}
          </div>
        );
      })}
    </>
  );
}
