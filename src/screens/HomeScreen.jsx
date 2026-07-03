import { theme, fontSerif, fontSans } from "../theme.js";
import { getSessions } from "../storage.js";
import { formatDuration, formatDate, isSameDay } from "../format.js";
import { Screen, Eyebrow, Card, PrimaryButton } from "../components/primitives.jsx";

export function HomeScreen({ onStart, onSettings }) {
  const sessions = getSessions();
  const lastSession = sessions[0];
  const todayCount = sessions.filter((s) => isSameDay(s.startTime, new Date())).length;

  return (
    <Screen>
      <div style={{ paddingTop: 14, marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Eyebrow>Session Companion</Eyebrow>
          <h1 style={{ fontFamily: fontSerif, fontSize: 42, fontWeight: 600, color: theme.bone, lineHeight: 1.05, letterSpacing: -0.5 }}>
            Stay
            <br />
            <em style={{ color: theme.sage, fontStyle: "italic" }}>grounded.</em>
          </h1>
        </div>
        <button
          onClick={onSettings}
          style={{ background: "none", border: "none", color: theme.faint, fontSize: 20, cursor: "pointer", padding: 6 }}
        >
          ⚙
        </button>
      </div>
      <div style={{ marginTop: 28 }}>
        {lastSession ? (
          <Card>
            <Eyebrow>Last Session</Eyebrow>
            <p style={{ fontFamily: fontSans, color: theme.bone, fontSize: 15, fontWeight: 600 }}>
              {formatDate(lastSession.startTime)}
              {lastSession.format ? ` · ${lastSession.format}` : ""}
            </p>
            {lastSession.endTime && (
              <p style={{ fontFamily: fontSans, color: theme.fade, fontSize: 13, marginTop: 3 }}>
                {formatDuration(new Date(lastSession.endTime) - new Date(lastSession.startTime))} long
              </p>
            )}
          </Card>
        ) : (
          <Card style={{ border: `1px dashed ${theme.line}`, textAlign: "center" }}>
            <p style={{ fontFamily: fontSans, color: theme.faint, fontSize: 14 }}>No sessions logged yet.</p>
          </Card>
        )}
        {todayCount >= 2 && (
          <Card style={{ borderColor: theme.roseDim }}>
            <p style={{ fontFamily: fontSans, color: theme.rose, fontSize: 13.5, fontWeight: 600 }}>
              ⚠ {todayCount} sessions logged today — worth a gut check on pace.
            </p>
          </Card>
        )}
      </div>
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <PrimaryButton tone="sage" onTap={onStart}>
          Begin Session
        </PrimaryButton>
      </div>
    </Screen>
  );
}
