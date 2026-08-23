import { useState } from "react";
import { theme, fontDisplay, fontSans, fontMono } from "../theme.js";
import { getSessions, saveSessions, getPeople } from "../storage.js";
import { Screen, Slab, Hatch, SlabHead, Chip, Input } from "../components/primitives.jsx";
import { EntryRow } from "../components/EntryRow.jsx";
import { SessionSummary } from "./SessionSummary.jsx";

const PERIODS = [
  { id: "all", label: "All time", days: null },
  { id: "7d", label: "7d", days: 7 },
  { id: "30d", label: "30d", days: 30 },
  { id: "90d", label: "90d", days: 90 },
];

export function HistoryScreen({ onBack }) {
  const [sessions, setSessions] = useState(getSessions());
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [formatFilter, setFormatFilter] = useState(null);
  const [placeFilter, setPlaceFilter] = useState(null);
  const [personFilter, setPersonFilter] = useState(null);
  const [period, setPeriod] = useState("all");
  const people = getPeople();
  const selected = sessions.find((s) => s.id === selectedId) || null;

  const handleEdit = (id, patch) => {
    const updated = sessions.map((s) => (s.id === id ? { ...s, ...patch } : s));
    setSessions(updated);
    saveSessions(updated);
  };
  const handleDelete = (id) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    saveSessions(updated);
    setSelectedId(null);
  };

  if (selected) {
    return (
      <SessionSummary
        key={selected.id}
        session={selected}
        onBack={() => setSelectedId(null)}
        onDone={() => setSelectedId(null)}
        onEdit={(patch) => handleEdit(selected.id, patch)}
        onDelete={() => handleDelete(selected.id)}
      />
    );
  }

  const formats = [...new Set(sessions.map((s) => s.method || s.format).filter(Boolean))];
  const places = [...new Set(sessions.map((s) => s.place).filter(Boolean))];
  const peopleInLog = people.filter((p) => sessions.some((s) => (s.peopleIds || []).includes(p.id)));

  const periodDays = PERIODS.find((p) => p.id === period)?.days;
  const cutoff = periodDays ? Date.now() - periodDays * 86400e3 : null;
  const q = query.trim().toLowerCase();
  const filtered = sessions.filter((s) => {
    if (cutoff && new Date(s.startTime).getTime() < cutoff) return false;
    if (formatFilter && (s.method || s.format) !== formatFilter) return false;
    if (placeFilter && s.place !== placeFilter) return false;
    if (personFilter && !(s.peopleIds || []).includes(personFilter)) return false;
    if (q) {
      const names = (s.peopleIds || []).map((id) => people.find((p) => p.id === id)?.name || "");
      const haystack = [s.intention, s.method || s.format, s.strain, s.place, s.notes, s.comedownNotes, s.reflection, ...names]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
  const filtersActive = q || formatFilter || placeFilter || personFilter || period !== "all";

  const chipRow = (items, active, onPick) => (
    <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2, marginBottom: 6 }}>
      {items.map(({ key, label }) => (
        <div key={key} style={{ flexShrink: 0 }}>
          <Chip label={label} size="sm" selected={active === key} onTap={() => onPick(active === key ? null : key)} />
        </div>
      ))}
    </div>
  );

  return (
    <Screen noBottomPad>
      <Slab>
        <Hatch />
        <SlabHead kicker="Journal" onBack={onBack} />
        <h2 style={{ fontFamily: fontDisplay, fontSize: 40, fontWeight: 700, textTransform: "uppercase", marginTop: 18, position: "relative" }}>
          History
        </h2>
      </Slab>
      <div style={{ flex: 1, padding: "22px 20px 24px", display: "flex", flexDirection: "column" }}>
        {sessions.length === 0 ? (
          <p style={{ fontFamily: fontSans, color: theme.n600, textAlign: "center", marginTop: 60 }}>Nothing logged yet.</p>
        ) : (
          <>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notes, places, people..." style={{ marginBottom: 10 }} />
            <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              {PERIODS.map((p) => (
                <Chip key={p.id} label={p.label} size="sm" selected={period === p.id} onTap={() => setPeriod(p.id)} />
              ))}
            </div>
            {formats.length > 1 && chipRow(formats.map((f) => ({ key: f, label: f })), formatFilter, setFormatFilter)}
            {places.length > 0 && chipRow(places.map((p) => ({ key: p, label: p })), placeFilter, setPlaceFilter)}
            {peopleInLog.length > 0 && chipRow(peopleInLog.map((p) => ({ key: p.id, label: p.name })), personFilter, setPersonFilter)}
            {filtersActive && (
              <p style={{ fontFamily: fontMono, fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: theme.n600, margin: "6px 0 8px" }}>
                {filtered.length} of {sessions.length} shown
              </p>
            )}
            <div style={{ flex: 1, overflowY: "auto", marginTop: filtersActive ? 0 : 8, display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.length === 0 ? (
                <p style={{ fontFamily: fontSans, color: theme.n600, textAlign: "center", marginTop: 40 }}>No sessions match.</p>
              ) : (
                filtered.map((session, i) => <EntryRow key={session.id} session={session} index={i} onTap={() => setSelectedId(session.id)} />)
              )}
            </div>
          </>
        )}
      </div>
    </Screen>
  );
}
