import { theme, fontDisplay, chamfer } from "../theme.js";
import { vibrate } from "../storage.js";

export function PinDots({ length, filled, error }) {
  return (
    <div style={{ display: "flex", gap: 14, justifyContent: "center", animation: error ? "sc-shake .35s" : "none" }}>
      {Array.from({ length }, (_, i) => (
        <div
          key={i}
          style={{
            width: 16,
            height: 16,
            border: `2px solid ${error ? theme.accent700 : theme.ink}`,
            background: i < filled ? (error ? theme.accent700 : theme.accent) : "transparent",
            clipPath: chamfer(4),
          }}
        />
      ))}
    </div>
  );
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

export function PinPad({ onDigit, onBackspace }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
      {KEYS.map((k, i) =>
        k === "" ? (
          <div key={i} />
        ) : (
          <button
            key={i}
            onClick={() => {
              vibrate();
              k === "back" ? onBackspace() : onDigit(k);
            }}
            aria-label={k === "back" ? "Backspace" : k}
            style={{
              aspectRatio: "1",
              border: `2px solid ${theme.ink}`,
              background: "transparent",
              color: theme.ink,
              fontFamily: fontDisplay,
              fontSize: k === "back" ? 18 : 24,
              fontWeight: 700,
              cursor: "pointer",
              clipPath: chamfer(10),
            }}
          >
            {k === "back" ? "←" : k}
          </button>
        )
      )}
    </div>
  );
}
