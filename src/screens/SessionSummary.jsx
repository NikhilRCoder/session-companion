import { theme, fontSerif, fontSans } from "../theme.js";
import { getPeople } from "../storage.js";
import { formatDuration, formatDate } from "../format.js";
import { Screen, Eyebrow, Card, StatRow, PrimaryButton } from "../components/primitives.jsx";

export function SessionSummary({ session, onDone }) {
  const people = getPeople();
  const duration = session.endTime
    ? formatDuration(new Date(session.endTime) - new Date(session.startTime))
    : "—";
  const peopleNames = (session.peopleIds || []).map((id) => people.find((p) => p.id === id)?.name).filter(Boolean);

  return (
    <Screen>
      <div style={{ paddingTop: 18, marginBottom: 24, textAlign: "center" }}>
        <span style={{ fontSize: 32, display: "block", marginBottom: 10 }}>🌿</span>
        <Eyebrow>Logged</Eyebrow>
        <h2 style={{ fontFamily: fontSerif, fontSize: 27, fontWeight: 600, color: theme.bone }}>That's a wrap.</h2>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Card>
          <StatRow label="Date" value={formatDate(session.startTime)} />
          <StatRow label="Duration" value={duration} />
          {session.format && <StatRow label="Format" value={session.format} />}
          {session.setting && <StatRow label="Setting" value={session.setting} />}
          {session.place && <StatRow label="Place" value={session.place} />}
        </Card>
        {(session.moodsPre?.length || session.moodsPost?.length) ? (
          <Card>
            <Eyebrow>Mood Shift</Eyebrow>
            {session.moodsPre?.length > 0 && (
              <p style={{ fontFamily: fontSans, color: theme.fade, fontSize: 14, marginTop: 8 }}>
                Before — <span style={{ color: theme.bone }}>{session.moodsPre.join(", ")}</span>
              </p>
            )}
            {session.moodsPost?.length > 0 && (
              <p style={{ fontFamily: fontSans, color: theme.fade, fontSize: 14, marginTop: 6 }}>
                After — <span style={{ color: theme.sage }}>{session.moodsPost.join(", ")}</span>
              </p>
            )}
          </Card>
        ) : null}
        {session.intensity && (
          <Card>
            <StatRow label="Intensity" value={session.intensity} />
            <StatRow label="Paranoia" value={session.paranoia} />
          </Card>
        )}
        {peopleNames.length > 0 && (
          <Card>
            <Eyebrow tone="rose">People</Eyebrow>
            {peopleNames.map((name) => (
              <StatRow
                key={name}
                label={name}
                value={session.interactionQuality?.[(people.find((p) => p.name === name) || {}).id] || "—"}
              />
            ))}
          </Card>
        )}
        {session.intention && (
          <Card>
            <Eyebrow>Intention</Eyebrow>
            <p style={{ fontFamily: fontSans, color: theme.fade, fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>
              {session.intention}
            </p>
          </Card>
        )}
        {session.notes && (
          <Card>
            <Eyebrow>Notes</Eyebrow>
            <p style={{ fontFamily: fontSans, color: theme.fade, fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>
              {session.notes}
            </p>
          </Card>
        )}
        {session.reflection && (
          <Card>
            <Eyebrow>Reflection</Eyebrow>
            <p style={{ fontFamily: fontSans, color: theme.fade, fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>
              {session.reflection}
            </p>
          </Card>
        )}
      </div>
      <div style={{ marginTop: 12 }}>
        <PrimaryButton tone="sage" onTap={onDone}>
          Done
        </PrimaryButton>
      </div>
    </Screen>
  );
}
