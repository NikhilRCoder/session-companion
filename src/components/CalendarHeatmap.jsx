import { theme, fontMono } from "../theme.js";
import { dayCounts } from "../stats.js";

const cellColor = (count) =>
  count === 0 ? theme.bgRaised : count === 1 ? `${theme.sage}59` : count === 2 ? `${theme.sage}a6` : theme.sage;

// 12 trailing weeks of session frequency, one square per day, columns are weeks.
export function CalendarHeatmap({ sessions }) {
  const days = dayCounts(sessions, 84);
  const weeks = [];
  for (let w = 0; w < 12; w++) weeks.push(days.slice(w * 7, w * 7 + 7));

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: 1,
          background: theme.line,
          border: `1px solid ${theme.line}`,
          boxShadow: theme.shadowCard,
        }}
      >
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "grid", gridTemplateRows: "repeat(7, 1fr)", gap: 1 }}>
            {week.map((day, di) => (
              <div
                key={di}
                title={`${day.date.toLocaleDateString()} — ${day.count} session${day.count === 1 ? "" : "s"}`}
                style={{ aspectRatio: "1", background: cellColor(day.count) }}
              />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontFamily: fontMono, fontSize: 9.5, letterSpacing: 1.5, textTransform: "uppercase", color: theme.faint }}>
          12 weeks ago
        </span>
        <span style={{ fontFamily: fontMono, fontSize: 9.5, letterSpacing: 1.5, textTransform: "uppercase", color: theme.faint }}>
          today
        </span>
      </div>
    </div>
  );
}
