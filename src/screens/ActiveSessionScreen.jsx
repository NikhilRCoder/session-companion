import { useState, useEffect } from "react";
import { theme, fontSans } from "../theme.js";
import { getPeople, vibrate } from "../storage.js";
import { formatTime } from "../format.js";
import { Screen, Eyebrow, Pill, TextArea, PrimaryButton } from "../components/primitives.jsx";
import { TimerRing } from "../components/TimerRing.jsx";

const CHECK_IN_AVAILABLE_AFTER_MS = 720 * 1e3;

export function ActiveSessionScreen({ live, onCheckIn, onEndDirect, onUpdateNotes }) {
  const [now, setNow] = useState(Date.now());
  const [notesOpen, setNotesOpen] = useState(false);
  const [confirmingEnd, setConfirmingEnd] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(id);
  }, []);

  const elapsedMs = now - new Date(live.startTime).getTime();
  const checkInAvailable = elapsedMs >= CHECK_IN_AVAILABLE_AFTER_MS;
  const people = getPeople();
  const peopleNames = (live.peopleIds || []).map((id) => people.find((p) => p.id === id)?.name).filter(Boolean);

  return (
    <Screen noBottomPad>
      <div style={{ paddingTop: 18, textAlign: "center", marginBottom: 6 }}>
        <Eyebrow tone="rose">Session Active</Eyebrow>
        <p style={{ fontFamily: fontSans, color: theme.faint, fontSize: 12.5 }}>
          since {formatTime(live.startTime)}
          {live.returnTime ? ` · target ${live.returnTime}` : ""}
        </p>
      </div>
      <div style={{ margin: "20px 0 26px" }}>
        <TimerRing elapsedMs={elapsedMs} />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 22 }}>
        {live.format && <Pill>{live.format}</Pill>}
        {live.setting && <Pill>{live.setting}</Pill>}
        {peopleNames.slice(0, 2).map((name) => (
          <Pill key={name}>{name}</Pill>
        ))}
      </div>
      <button
        onClick={() => {
          vibrate();
          setNotesOpen(!notesOpen);
        }}
        style={{
          width: "100%",
          background: theme.bgCard,
          border: `1px solid ${theme.line}`,
          borderRadius: 16,
          padding: "14px 16px",
          color: theme.fade,
          fontFamily: fontSans,
          fontSize: 14,
          fontWeight: 600,
          textAlign: "left",
          marginBottom: notesOpen ? 10 : 22,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>✎ Notes {live.notes ? "· saved" : ""}</span>
        <span style={{ color: theme.faint }}>{notesOpen ? "−" : "+"}</span>
      </button>
      {notesOpen && (
        <TextArea
          autoFocus
          value={live.notes || ""}
          onChange={(e) => onUpdateNotes(e.target.value)}
          placeholder="What's on your mind..."
          rows={4}
          style={{ marginBottom: 22, background: theme.bgRaised }}
        />
      )}
      <div style={{ marginTop: "auto", paddingBottom: 26 }}>
        <PrimaryButton tone={checkInAvailable ? "gold" : "ghost"} onTap={onCheckIn} style={{ marginBottom: 10 }}>
          {checkInAvailable
            ? "I'm Ready to Check In"
            : `Check In Available Soon (~${Math.ceil((CHECK_IN_AVAILABLE_AFTER_MS - elapsedMs) / 6e4)}m)`}
        </PrimaryButton>
        {confirmingEnd ? (
          <div style={{ display: "flex", gap: 10 }}>
            <PrimaryButton tone="ghost" onTap={() => setConfirmingEnd(false)} style={{ flex: 1 }}>
              Cancel
            </PrimaryButton>
            <PrimaryButton tone="danger" onTap={onEndDirect} style={{ flex: 1, borderColor: theme.danger }}>
              Confirm End
            </PrimaryButton>
          </div>
        ) : (
          <PrimaryButton tone="danger" onTap={() => setConfirmingEnd(true)}>
            End Session Now
          </PrimaryButton>
        )}
      </div>
    </Screen>
  );
}
