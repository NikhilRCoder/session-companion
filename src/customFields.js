import { getFields } from "./storage.js";

export const fieldsFor = (phase) => getFields().filter((f) => f.phase === phase);

// Splits wizard answers into built-in fields (matched by key) vs custom-field entries.
export function splitCustomAnswers(answers, builtinKeys, fields) {
  const builtin = new Set(builtinKeys);
  const rest = {};
  const custom = {};
  for (const [key, raw] of Object.entries(answers)) {
    if (builtin.has(key)) {
      rest[key] = raw;
      continue;
    }
    const field = fields.find((f) => f.id === key);
    if (!field) continue;
    const value = field.type === "number" ? (String(raw).trim() === "" ? undefined : Number(raw)) : raw;
    if (value !== undefined && value !== "") {
      custom[key] = { label: field.label, type: field.type, value };
    }
  }
  return { rest, custom };
}
