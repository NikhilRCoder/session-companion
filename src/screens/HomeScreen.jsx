import { useState } from "react";
import { theme, fontDisplay, fontSans, chamfer } from "../theme.js";
import { getSessions, getBreakState, setBreakState } from "../storage.js";
import { isSameDay } from "../format.js";
import { daysSinceLast, longestBreak, countSince, avgPerWeek } from "../stats.js";
import { Screen, Slab, Hatch, Ring, Dia, Card, StatsGrid, StatBox } from "../components/primitives.jsx";
import { EntryRow } from "../components/EntryRow.jsx";
import { BreakCard } from "../components/BreakCard.jsx";
import { Arrow, ClockIcon } from "../components/icons.jsx";

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Good\nnight";
  if (h < 12) return "Good\nmorning";
  if (h < 18) return "Good\nafternoon";
  return "Good\nevening";
}

export function HomeScreen({ onStart, onHistory, onSettings }) {
  const sessions = getSessions();
  const todayCount = sessions.filter((s) => isSameDay(s.startTime, new Date())).length;
  const sinceLast = daysSinceLast(sessions);
  const longest = longestBreak(sessions);
  const [line1, line2] = greeting().split("\n");
  const [breakState, setBreakStateLocal] = useState(getBreakState());
  const startBreak = () => {
    const value = { startedAt: new Date().toISOString() };
    setBreakState(value);
    setBreakStateLocal(value);
  };
  const endBreak = () => {
    setBreakState(null);
    setBreakStateLocal(null);
  };

  return (
    <Screen noBottomPad>
      <Slab style={{ padding: "22px 20px 26px" }}>
        <Hatch style={{ width: 150, clipPath: "polygon(56px 0,100% 0,100% 100%,0 100%)", opacity: 0.55 }} />
        <div style={{ position: "relative", display: "flex", alignItems: "flex-start" }}>
          <span style={{ display: "inline-block", transform: "skewX(-11deg)", background: theme.accent, padding: "5px 12px" }}>
            <span style={{ display: "block", transform: "skewX(11deg)", fontFamily: fontDisplay, fontWeight: 700, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: theme.surface }}>
              Session Companion
            </span>
          </span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button
              onClick={onSettings}
              aria-label="Settings"
              style={{ width: 40, height: 40, background: "transparent", border: "2px solid currentColor", color: "inherit", cursor: "pointer", clipPath: chamfer(12), fontSize: 18 }}
            >
              ⚙
            </button>
            <button
              onClick={onHistory}
              aria-label="History"
              style={{ width: 40, height: 40, background: "transparent", border: "2px solid currentColor", color: "inherit", cursor: "pointer", clipPath: chamfer(12) }}
            >
              <ClockIcon />
            </button>
          </div>
        </div>
        <h1 style={{ fontFamily: fontDisplay, fontSize: 48, fontWeight: 700, textTransform: "uppercase", lineHeight: 0.9, letterSpacing: "-0.02em", marginTop: 22, position: "relative" }}>
          {line1}
          <br />
          {line2}
          <span style={{ color: theme.accent }}>.</span>
        </h1>
        <div style={{ position: "relative", marginTop: 14, display: "flex", alignItems: "center", gap: 8, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: theme.n400, fontFamily: fontSans }}>
          <Dia /> {sessions.length} session{sessions.length === 1 ? "" : "s"} logged
        </div>
      </Slab>
      <button
        onClick={onStart}
        style={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          border: "none",
          textAlign: "left",
          background: theme.accent,
          color: theme.surface,
          padding: "26px 20px",
          cursor: "pointer",
          fontFamily: fontDisplay,
          clipPath: chamfer(22),
        }}
      >
        <Ring style={{ right: -22, bottom: -34, width: 120, height: 120, color: theme.surface }} />
        <span style={{ position: "relative", display: "block", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, opacity: 0.85 }}>
          Begin
        </span>
        <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 6 }}>
          <span style={{ fontSize: 30, fontWeight: 700, lineHeight: 1, textTransform: "uppercase" }}>Start a session</span>
          <Arrow />
        </span>
      </button>
      <div style={{ flex: 1, padding: "26px 20px 28px" }}>
        {sessions.length > 0 && (
          <StatsGrid style={{ marginBottom: 22 }}>
            <StatBox label="Days Since Last" value={sinceLast === 0 ? "Today" : `${sinceLast}d`} />
            <StatBox label="Longest Break" value={`${longest}d`} />
            <StatBox label="This Week" value={countSince(sessions, 7)} />
            <StatBox label="Avg / Week" value={avgPerWeek(sessions).toFixed(1)} />
          </StatsGrid>
        )}
        <BreakCard breakState={breakState} longestPastBreak={longest} onStart={startBreak} onEnd={endBreak} />
        {todayCount >= 2 && (
          <Card style={{ borderColor: theme.accent }}>
            <p style={{ fontFamily: fontSans, color: theme.accent700, fontSize: 13.5, fontWeight: 600 }}>
              {todayCount} sessions logged today — worth a gut check on pace.
            </p>
          </Card>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
          <Dia ink />
          <span style={{ fontFamily: fontDisplay, fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: theme.ink }}>
            Recent
          </span>
          <span style={{ flex: 1, height: 2, background: theme.ink }} />
        </div>
        {sessions.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sessions.slice(0, 2).map((s, i) => (
              <EntryRow key={s.id} session={s} index={i} onTap={onHistory} />
            ))}
          </div>
        ) : (
          <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 13, margin: 0 }}>
            No sessions logged yet. Start one to begin the journal.
          </p>
        )}
      </div>
    </Screen>
  );
}
