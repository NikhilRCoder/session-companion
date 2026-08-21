import { useState } from "react";
import { theme, fontDisplay, fontSans, fontMono } from "../theme.js";
import { getSessions, saveSessions, getPeople } from "../storage.js";
import { formatDuration, formatDate } from "../format.js";
import { Screen, BackLink, ChoiceChip } from "../components/primitives.jsx";
import { SessionSummary } from "./SessionSummary.jsx";

const PERIODS = [
  { id: "all", label: "All time", days: null },
  { id: "7d", label: "7d", days: 7 },
  { id: "30d", label: "30d", days: 30 },
  { id: "90d", label: "90d", days: 90 },
];

export function HistoryScreen() {
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
      <Screen>
        <BackLink onBack={() => setSelectedId(null)} label="← All Sessions" />
        <div style={{ flex: 1, overflowY: "auto" }}>
          <SessionSummary
            key={selected.id}
            session={selected}
            onDone={() => setSelectedId(null)}
            onEdit={(patch) => handleEdit(selected.id, patch)}
            onDelete={() => handleDelete(selected.id)}
          />
        </div>
      </Screen>
    );
  }

  const formats = [...new Set(sessions.map((s) => s.format).filter(Boolean))];
  const places = [...new Set(sessions.map((s) => s.place).filter(Boolean))];
  const peopleInLog = people.filter((p) => sessions.some((s) => (s.peopleIds || []).includes(p.id)));

  const periodDays = PERIODS.find((p) => p.id === period)?.days;
  const cutoff = periodDays ? Date.now() - periodDays * 86400e3 : null;
  const q = query.trim().toLowerCase();
  const filtered = sessions.filter((s) => {
    if (cutoff && new Date(s.startTime).getTime() < cutoff) return false;
    if (formatFilter && s.format !== formatFilter) return false;
    if (placeFilter && s.place !== placeFilter) return false;
    if (personFilter && !(s.peopleIds || []).includes(personFilter)) return false;
    if (q) {
      const names = (s.peopleIds || []).map((id) => people.find((p) => p.id === id)?.name || "");
      const haystack = [s.format, s.setting, s.place, s.intention, s.notes, s.reflection, ...names]
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
          <ChoiceChip label={label} tone="sage" selected={active === key} onTap={() => onPick(active === key ? null : key)} />
        </div>
      ))}
    </div>
  );

  return (
    <Screen>
      <h2 style={{ fontFamily: fontDisplay, fontSize: 27, fontWeight: 700, color: theme.bone, marginTop: 14, marginBottom: 14 }}>
        History
      </h2>
      {sessions.length === 0 ? (
        <p style={{ fontFamily: fontSans, color: theme.faint, textAlign: "center", marginTop: 60 }}>
          Nothing logged yet.
        </p>
      ) : (
        <>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, places, people..."
            style={{
              width: "100%",
              background: theme.bgCard,
              border: `1px solid ${theme.line}`,
              borderRadius: 0,
              padding: "12px 14px",
              color: theme.bone,
              fontSize: 14,
              fontFamily: fontSans,
              boxSizing: "border-box",
              marginBottom: 10,
            }}
          />
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            {PERIODS.map((p) => (
              <ChoiceChip key={p.id} label={p.label} tone="sage" selected={period === p.id} onTap={() => setPeriod(p.id)} />
            ))}
          </div>
          {formats.length > 1 && chipRow(formats.map((f) => ({ key: f, label: f })), formatFilter, setFormatFilter)}
          {places.length > 0 && chipRow(places.map((p) => ({ key: p, label: p })), placeFilter, setPlaceFilter)}
          {peopleInLog.length > 0 && chipRow(peopleInLog.map((p) => ({ key: p.id, label: p.name })), personFilter, setPersonFilter)}
          {filtersActive && (
            <p style={{ fontFamily: fontMono, fontSize: 10.5, letterSpacing: 1.5, textTransform: "uppercase", color: theme.faint, margin: "6px 0 8px" }}>
              {filtered.length} of {sessions.length} shown
            </p>
          )}
          <div style={{ flex: 1, overflowY: "auto", marginTop: filtersActive ? 0 : 8 }}>
            {filtered.length === 0 ? (
              <p style={{ fontFamily: fontSans, color: theme.faint, textAlign: "center", marginTop: 40 }}>
                No sessions match.
              </p>
            ) : (
              filtered.map((session) => {
                const duration = session.endTime
                  ? formatDuration(new Date(session.endTime) - new Date(session.startTime))
                  : "Incomplete";
                return (
                  <button
                    key={session.id}
                    onClick={() => setSelectedId(session.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: theme.bgCard,
                      border: `1px solid ${theme.line}`,
                      borderRadius: 0,
                      padding: 16,
                      marginBottom: 10,
                      cursor: "pointer",
                      fontFamily: fontSans,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: theme.bone, fontSize: 14.5, fontWeight: 700 }}>
                        {formatDate(session.startTime)}
                      </span>
                      <span style={{ color: theme.sageDim, fontSize: 12.5, fontFamily: fontMono }}>{duration}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {session.format && <span style={{ color: theme.faint, fontSize: 12 }}>{session.format}</span>}
                      {session.setting && <span style={{ color: theme.faint, fontSize: 12 }}>· {session.setting}</span>}
                      {session.place && <span style={{ color: theme.faint, fontSize: 12 }}>· {session.place}</span>}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </>
      )}
    </Screen>
  );
}
