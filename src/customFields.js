import { getFields } from "./storage.js";

export const fieldToStep = (field) => ({
  key: field.id,
  q: field.label,
  icon: "✦",
  optional: true,
  ...(field.type === "choice"
    ? { options: field.options || [] }
    : field.type === "yesno"
    ? { options: ["Yes", "No"] }
    : { input: field.type }),
});

export const customStepsFor = (phase) =>
  getFields()
    .filter((f) => f.phase === phase)
    .map(fieldToStep);

// Splits wizard answers into built-in fields vs custom-field entries.
// Partitions by the built-in step keyset so an answer for a since-deleted
// field is dropped rather than spread onto the session's top level.
export function splitCustomAnswers(answers, builtinSteps, fields) {
  const builtinKeys = new Set(builtinSteps.map((s) => s.key));
  const rest = {};
  const custom = {};
  for (const [key, raw] of Object.entries(answers)) {
    if (builtinKeys.has(key)) {
      rest[key] = raw;
      continue;
    }
    const field = fields.find((f) => f.id === key);
    if (!field) continue;
    const value =
      field.type === "number" ? (String(raw).trim() === "" ? undefined : Number(raw)) : raw;
    if (value !== undefined && value !== "") {
      custom[key] = { label: field.label, type: field.type, value };
    }
  }
  return { rest, custom };
}
