import { theme, fontSans } from "../theme.js";

const VIEW_WIDTH = 320;
const VIEW_HEIGHT = 110;
const BASELINE_Y = 50;
const HALF_PLOT = 34;
const MAX_BAR_THICKNESS = 22;

function roundedBar(x, width, height, direction) {
  const radius = Math.min(4, height / 2, width / 2);
  if (height <= 0) return null;
  if (direction === "up") {
    const top = BASELINE_Y - height;
    return `M${x},${BASELINE_Y} L${x},${top + radius} Q${x},${top} ${x + radius},${top} L${x + width - radius},${top} Q${x + width},${top} ${x + width},${top + radius} L${x + width},${BASELINE_Y} Z`;
  }
  const bottom = BASELINE_Y + height;
  return `M${x},${BASELINE_Y} L${x},${bottom - radius} Q${x},${bottom} ${x + radius},${bottom} L${x + width - radius},${bottom} Q${x + width},${bottom} ${x + width},${bottom - radius} L${x + width},${BASELINE_Y} Z`;
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
        <line x1="0" y1={BASELINE_Y} x2={VIEW_WIDTH} y2={BASELINE_Y} stroke={theme.line} strokeWidth="1" />
        {values.map((value, i) => {
          const x = i * slotWidth + (slotWidth - barWidth) / 2;
          if (value === null) {
            return <circle key={i} cx={x + barWidth / 2} cy={BASELINE_Y} r="2" fill={theme.faint} />;
          }
          if (value === 0) {
            return <rect key={i} x={x} y={BASELINE_Y - 2} width={barWidth} height="4" rx="2" fill={theme.line} />;
          }
          const height = (Math.abs(value) / maxAbs) * HALF_PLOT;
          const direction = value > 0 ? "up" : "down";
          const path = roundedBar(x, barWidth, height, direction);
          return <path key={i} d={path} fill={value > 0 ? theme.sage : theme.rose} />;
        })}
        {lastValue !== null && (
          <text
            x={lastIndex * slotWidth + slotWidth / 2}
            y={lastValue >= 0 ? BASELINE_Y - HALF_PLOT - 8 : BASELINE_Y + HALF_PLOT + 14}
            textAnchor="middle"
            fontFamily={fontSans}
            fontSize="9"
            fill={theme.fade}
          >
            {lastValue > 0 ? "+" : ""}
            {lastValue.toFixed(1)}
          </text>
        )}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <span style={{ fontFamily: fontSans, fontSize: 10, color: theme.faint }}>{values.length} wks ago</span>
        <span style={{ fontFamily: fontSans, fontSize: 10, color: theme.faint }}>now</span>
      </div>
    </div>
  );
}
