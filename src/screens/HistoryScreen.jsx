import { useState } from "react";
import { theme, fontSerif, fontSans } from "../theme.js";
import { getSessions } from "../storage.js";
import { formatDuration, formatDate } from "../format.js";
import { Screen, BackLink } from "../components/primitives.jsx";
import { SessionSummary } from "./SessionSummary.jsx";

export function HistoryScreen() {
  const [sessions] = useState(getSessions());
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <Screen>
        <BackLink onBack={() => setSelected(null)} label="← All Sessions" />
        <div style={{ flex: 1, overflowY: "auto" }}>
          <SessionSummary session={selected} onDone={() => setSelected(null)} />
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <h2 style={{ fontFamily: fontSerif, fontSize: 27, fontWeight: 600, color: theme.bone, marginTop: 14, marginBottom: 18 }}>
        History
      </h2>
      {sessions.length === 0 ? (
        <p style={{ fontFamily: fontSans, color: theme.faint, textAlign: "center", marginTop: 60 }}>
          Nothing logged yet.
        </p>
      ) : (
        <div style={{ flex: 1, overflowY: "auto" }}>
          {sessions.map((session, i) => {
            const duration = session.endTime
              ? formatDuration(new Date(session.endTime) - new Date(session.startTime))
              : "Incomplete";
            return (
              <button
                key={i}
                onClick={() => setSelected(session)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: theme.bgCard,
                  border: `1px solid ${theme.line}`,
                  borderRadius: 16,
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
                  <span style={{ color: theme.sageDim, fontSize: 13 }}>{duration}</span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {session.format && <span style={{ color: theme.faint, fontSize: 12 }}>{session.format}</span>}
                  {session.setting && <span style={{ color: theme.faint, fontSize: 12 }}>· {session.setting}</span>}
                  {session.place && <span style={{ color: theme.faint, fontSize: 12 }}>· {session.place}</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </Screen>
  );
}
