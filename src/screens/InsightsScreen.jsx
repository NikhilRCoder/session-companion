import { useState } from "react";
import { theme, fontDisplay, fontSans } from "../theme.js";
import { getSessions, getPeople } from "../storage.js";
import { computeInsights } from "../insights.jsx";
import { formatDuration } from "../format.js";
import { totalDistance, formatDistance } from "../geo.js";
import { countSince } from "../stats.js";
import { Screen, Slab, Hatch, Body, SectionRule, Card, StatsGrid, StatBox } from "../components/primitives.jsx";
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
        <h2 style={{ fontFamily: fontDisplay, fontSize: 27, fontWeight: 700, textTransform: "uppercase", color: theme.ink, marginTop: 14, marginBottom: 18 }}>
          Insights
        </h2>
        <p style={{ fontFamily: fontSans, color: theme.n600, textAlign: "center", marginTop: 60 }}>Log a few sessions and patterns will show up here.</p>
      </Screen>
    );
  }

  const finished = sessions.filter((s) => s.endTime);
  const avgDurationMs = finished.length ? finished.reduce((sum, s) => sum + (new Date(s.endTime) - new Date(s.startTime)), 0) / finished.length : 0;
  const spends = sessions.filter((s) => typeof s.cost === "number");
  const totalSpend = spends.reduce((sum, s) => sum + s.cost, 0);
  const distance = sessions.reduce((sum, s) => sum + (s.track?.length >= 2 ? totalDistance(s.track) : 0), 0);

  return (
    <Screen noBottomPad>
      <Slab>
        <Hatch />
        <h2 style={{ fontFamily: fontDisplay, fontSize: 34, fontWeight: 700, textTransform: "uppercase", position: "relative" }}>Insights</h2>
      </Slab>
      <Body style={{ gap: 20, overflowY: "auto" }}>
        <StatsGrid>
          <StatBox label="This Week" value={countSince(sessions, 7)} />
          <StatBox label="This Month" value={countSince(sessions, 30)} />
          <StatBox label="Avg Duration" value={avgDurationMs ? formatDuration(avgDurationMs) : "—"} />
          <StatBox label="Total Logged" value={sessions.length} />
          <StatBox label="Total Spend" value={spends.length ? `$${totalSpend.toFixed(0)}` : "—"} />
          <StatBox label="Avg Spend" value={spends.length ? `$${(totalSpend / spends.length).toFixed(2)}` : "—"} />
          <StatBox label="Top Method" value={mostCommon(sessions.map((s) => s.method || s.format))} />
          <StatBox label="Top Place" value={mostCommon(sessions.map((s) => s.place))} />
          {distance > 0 && <StatBox label="Distance Moved" value={formatDistance(distance)} span={2} />}
        </StatsGrid>
        <div>
          <SectionRule ink>Frequency</SectionRule>
          <CalendarHeatmap sessions={sessions} />
        </div>
        {nudges.map((nudge, i) => (
          <Card key={i}>
            <p style={{ fontFamily: fontSans, fontSize: 13.5, color: theme.accent700, fontWeight: 600 }}>{nudge.text}</p>
          </Card>
        ))}
        {cards.map((card) => (
          <Card key={card.id}>
            <button onClick={() => setExpandedId(expandedId === card.id ? null : card.id)} style={{ width: "100%", background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <SectionRule>{card.title}</SectionRule>
                  <p style={{ fontFamily: fontDisplay, fontSize: 22, color: theme.ink, fontWeight: 700, textTransform: "uppercase" }}>{card.value}</p>
                </div>
                <span style={{ color: theme.n600, fontSize: 18 }}>{expandedId === card.id ? "−" : "+"}</span>
              </div>
            </button>
            {expandedId === card.id && <div style={{ marginTop: 14 }}>{card.detail}</div>}
          </Card>
        ))}
      </Body>
    </Screen>
  );
}
