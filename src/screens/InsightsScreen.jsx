import { useState } from "react";
import { theme, fontDisplay, fontSans } from "../theme.js";
import { getSessions, getPeople } from "../storage.js";
import { computeInsights } from "../insights.jsx";
import { formatDuration } from "../format.js";
import { totalDistance, formatDistance } from "../geo.js";
import { countSince } from "../stats.js";
import { Screen, Eyebrow, Card, StatGrid, StatBox } from "../components/primitives.jsx";
import { CalendarHeatmap } from "../components/CalendarHeatmap.jsx";

const mostCommon = (values) => {
  const counts = {};
  for (const v of values) if (v) counts[v] = (counts[v] || 0) + 1;
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top ? top[0] : "—";
};

export function InsightsScreen() {
  const [sessions] = useState(getSessions());
  const [people] = useState(getPeople());
  const [expandedId, setExpandedId] = useState(null);
  const { cards, nudges } = computeInsights(sessions, people);

  if (sessions.length === 0) {
    return (
      <Screen>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 27, fontWeight: 700, color: theme.bone, marginTop: 14, marginBottom: 18 }}>
          Insights
        </h2>
        <p style={{ fontFamily: fontSans, color: theme.faint, textAlign: "center", marginTop: 60 }}>
          Log a few sessions and patterns will show up here.
        </p>
      </Screen>
    );
  }

  const finished = sessions.filter((s) => s.endTime);
  const avgDurationMs = finished.length
    ? finished.reduce((sum, s) => sum + (new Date(s.endTime) - new Date(s.startTime)), 0) / finished.length
    : 0;
  const spends = sessions.filter((s) => typeof s.cost === "number");
  const totalSpend = spends.reduce((sum, s) => sum + s.cost, 0);
  const distance = sessions.reduce((sum, s) => sum + (s.track?.length >= 2 ? totalDistance(s.track) : 0), 0);

  return (
    <Screen>
      <h2 style={{ fontFamily: fontDisplay, fontSize: 27, fontWeight: 700, color: theme.bone, marginTop: 14, marginBottom: 18 }}>
        Insights
      </h2>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <StatGrid>
          <StatBox label="This Week" value={countSince(sessions, 7)} accent={theme.sage} icon="◒" />
          <StatBox label="This Month" value={countSince(sessions, 30)} accent={theme.sage} icon="◓" />
          <StatBox label="Avg Duration" value={avgDurationMs ? formatDuration(avgDurationMs) : "—"} accent={theme.gold} icon="◷" />
          <StatBox label="Total Logged" value={sessions.length} accent={theme.fade} icon="▣" />
          <StatBox label="Total Spend" value={spends.length ? `$${totalSpend.toFixed(0)}` : "—"} accent={theme.gold} icon="◈" />
          <StatBox
            label="Avg Spend"
            value={spends.length ? `$${(totalSpend / spends.length).toFixed(2)}` : "—"}
            sub={spends.length ? `${spends.length} tracked` : undefined}
            accent={theme.gold}
            icon="◈"
          />
          <StatBox label="Top Format" value={mostCommon(sessions.map((s) => s.format))} accent={theme.sage} icon="◆" />
          <StatBox label="Top Place" value={mostCommon(sessions.map((s) => s.place))} accent={theme.rose} icon="◍" />
          {distance > 0 && (
            <StatBox
              label="Distance Moved"
              value={formatDistance(distance)}
              span={2}
              sub="across tracked sessions"
              accent={theme.sage}
              icon="→"
            />
          )}
        </StatGrid>
        <Card>
          <Eyebrow>Frequency</Eyebrow>
          <div style={{ marginTop: 10 }}>
            <CalendarHeatmap sessions={sessions} />
          </div>
        </Card>
        {nudges.map((nudge, i) => (
          <Card key={i} style={{ borderColor: nudge.tone === "rose" ? theme.roseDim : theme.sageDim }}>
            <p style={{ fontFamily: fontSans, fontSize: 13.5, color: nudge.tone === "rose" ? theme.rose : theme.sage, fontWeight: 600 }}>
              {nudge.text}
            </p>
          </Card>
        ))}
        {cards.map((card) => (
          <Card key={card.id}>
            <button
              onClick={() => setExpandedId(expandedId === card.id ? null : card.id)}
              style={{ width: "100%", background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <Eyebrow tone={card.tone === "rose" ? "rose" : "sage"}>{card.title}</Eyebrow>
                  <p style={{ fontFamily: fontDisplay, fontSize: 22, color: theme.bone, fontWeight: 700 }}>{card.value}</p>
                </div>
                <span style={{ color: theme.faint, fontSize: 18 }}>{expandedId === card.id ? "−" : "+"}</span>
              </div>
            </button>
            {expandedId === card.id && <div style={{ marginTop: 14 }}>{card.detail}</div>}
          </Card>
        ))}
      </div>
    </Screen>
  );
}
