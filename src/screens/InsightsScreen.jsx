import { useState } from "react";
import { theme, fontSerif, fontSans } from "../theme.js";
import { getSessions, getPeople } from "../storage.js";
import { computeInsights } from "../insights.jsx";
import { Screen, Eyebrow, Card } from "../components/primitives.jsx";

export function InsightsScreen() {
  const [sessions] = useState(getSessions());
  const [people] = useState(getPeople());
  const [expandedId, setExpandedId] = useState(null);
  const { cards, nudges } = computeInsights(sessions, people);

  if (sessions.length === 0) {
    return (
      <Screen>
        <h2 style={{ fontFamily: fontSerif, fontSize: 27, fontWeight: 600, color: theme.bone, marginTop: 14, marginBottom: 18 }}>
          Insights
        </h2>
        <p style={{ fontFamily: fontSans, color: theme.faint, textAlign: "center", marginTop: 60 }}>
          Log a few sessions and patterns will show up here.
        </p>
      </Screen>
    );
  }

  return (
    <Screen>
      <h2 style={{ fontFamily: fontSerif, fontSize: 27, fontWeight: 600, color: theme.bone, marginTop: 14, marginBottom: 18 }}>
        Insights
      </h2>
      <div style={{ flex: 1, overflowY: "auto" }}>
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
                  <p style={{ fontFamily: fontSerif, fontSize: 22, color: theme.bone, fontWeight: 600 }}>{card.value}</p>
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
