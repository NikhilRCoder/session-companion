import { theme, fontSans } from "../theme.js";
import { dayCounts } from "../stats.js";

const cellColor = (count) => (count === 0 ? theme.n300 : count === 1 ? `${theme.accent}59` : count === 2 ? `${theme.accent}a6` : theme.accent);

// 12 trailing weeks of session frequency, one square per day, columns are weeks.
export function CalendarHeatmap({ sessions }) {
  const days = dayCounts(sessions, 84);
  const weeks = [];
  for (let w = 0; w < 12; w++) weeks.push(days.slice(w * 7, w * 7 + 7));

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 1, background: theme.ink, border: `2px solid ${theme.ink}` }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "grid", gridTemplateRows: "repeat(7, 1fr)", gap: 1 }}>
            {week.map((day, di) => (
              <div key={di} title={`${day.date.toLocaleDateString()} — ${day.count} session${day.count === 1 ? "" : "s"}`} style={{ aspectRatio: "1", background: cellColor(day.count) }} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontFamily: fontSans, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: theme.n600 }}>12 weeks ago</span>
        <span style={{ fontFamily: fontSans, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: theme.n600 }}>today</span>
      </div>
    </div>
  );
}
