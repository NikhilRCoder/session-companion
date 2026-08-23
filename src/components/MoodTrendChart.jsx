import { theme, fontSans } from "../theme.js";

const VIEW_WIDTH = 320;
const VIEW_HEIGHT = 110;
const BASELINE_Y = 50;
const HALF_PLOT = 34;
const MAX_BAR_THICKNESS = 22;

function bar(x, width, height, direction) {
  if (height <= 0) return null;
  return direction === "up"
    ? `M${x},${BASELINE_Y} L${x},${BASELINE_Y - height} L${x + width},${BASELINE_Y - height} L${x + width},${BASELINE_Y} Z`
    : `M${x},${BASELINE_Y} L${x},${BASELINE_Y + height} L${x + width},${BASELINE_Y + height} L${x + width},${BASELINE_Y} Z`;
}

export function MoodTrendChart({ values }) {
  const maxAbs = Math.max(1, ...values.filter((v) => v !== null).map((v) => Math.abs(v)));
  const slotWidth = VIEW_WIDTH / values.length;
  const barWidth = Math.min(MAX_BAR_THICKNESS, slotWidth - 6);
  const lastIndex = values.length - 1;
  const lastValue = values[lastIndex];

  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} role="img" aria-label="Mood trend over recent weeks">
        <line x1="0" y1={BASELINE_Y} x2={VIEW_WIDTH} y2={BASELINE_Y} stroke={theme.n400} strokeWidth="2" />
        {values.map((value, i) => {
          const x = i * slotWidth + (slotWidth - barWidth) / 2;
          if (value === null) return <circle key={i} cx={x + barWidth / 2} cy={BASELINE_Y} r="2" fill={theme.n500} />;
          if (value === 0) return <rect key={i} x={x} y={BASELINE_Y - 2} width={barWidth} height="4" fill={theme.n400} />;
          const height = (Math.abs(value) / maxAbs) * HALF_PLOT;
          return <path key={i} d={bar(x, barWidth, height, value > 0 ? "up" : "down")} fill={value > 0 ? theme.accent : theme.n700} />;
        })}
        {lastValue !== null && (
          <text
            x={lastIndex * slotWidth + slotWidth / 2}
            y={lastValue >= 0 ? BASELINE_Y - HALF_PLOT - 8 : BASELINE_Y + HALF_PLOT + 14}
            textAnchor="middle"
            fontFamily={fontSans}
            fontSize="9"
            fill={theme.n600}
          >
            {lastValue > 0 ? "+" : ""}
            {lastValue.toFixed(1)}
          </text>
        )}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <span style={{ fontFamily: fontSans, fontSize: 10, color: theme.n600 }}>{values.length} wks ago</span>
        <span style={{ fontFamily: fontSans, fontSize: 10, color: theme.n600 }}>now</span>
      </div>
    </div>
  );
}
