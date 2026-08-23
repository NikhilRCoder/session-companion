import { theme, fontDisplay, fontSans, chamfer } from "../theme.js";
import { formatDate, formatDuration } from "../format.js";

export function EntryRow({ session, index, onTap }) {
  const duration = session.endTime ? formatDuration(new Date(session.endTime) - new Date(session.startTime)) : "In progress";
  const name = [session.intention, session.method || session.format].filter(Boolean).join(" / ") || "Session";
  const subParts = [];
  if (session.strain) subParts.push(session.strain);
  if (session.rating) subParts.push(`rated ${session.rating}/5`);
  const sub = subParts.join(" — ") || "Unlogged";

  return (
    <button
      onClick={onTap}
      style={{
        textAlign: "left",
        width: "100%",
        border: `2px solid ${theme.ink}`,
        borderLeft: `8px solid ${theme.accent}`,
        background: theme.surface,
        padding: "14px 16px",
        cursor: "pointer",
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        fontFamily: fontSans,
        color: theme.ink,
        clipPath: chamfer(16),
      }}
    >
      <span style={{ fontFamily: fontDisplay, fontSize: 26, fontWeight: 700, lineHeight: 1, fontVariantNumeric: "tabular-nums", color: theme.n400 }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: theme.n600 }}>
          {formatDate(session.startTime)} — {duration}
        </span>
        <span style={{ display: "block", fontFamily: fontDisplay, fontSize: 19, fontWeight: 700, textTransform: "uppercase", marginTop: 3 }}>
          {name}
        </span>
        <span style={{ display: "block", fontSize: 12, color: theme.n600, marginTop: 2 }}>{sub}</span>
      </span>
    </button>
  );
}
