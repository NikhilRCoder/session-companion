import { theme, fontMono } from "../theme.js";
import { vibrate } from "../storage.js";

const TABS = [
  { id: "home", label: "Home", icon: "◆" },
  { id: "history", label: "History", icon: "☰" },
  { id: "people", label: "People", icon: "◍" },
  { id: "insights", label: "Insights", icon: "◬" },
];

export function BottomNav({ active, onChange }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 1,
        background: theme.line,
        borderTop: `1px solid ${theme.line}`,
        paddingBottom: 0,
      }}
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            vibrate(6);
            onChange(tab.id);
          }}
          style={{
            background: theme.bg,
            border: "none",
            borderTop: `2px solid ${active === tab.id ? theme.sage : "transparent"}`,
            cursor: "pointer",
            padding: "9px 0 max(10px, env(safe-area-inset-bottom))",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <span style={{ fontSize: 16, color: active === tab.id ? theme.sage : theme.faint }}>{tab.icon}</span>
          <span
            style={{
              fontFamily: fontMono,
              fontSize: 9.5,
              fontWeight: 500,
              color: active === tab.id ? theme.sage : theme.faint,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}
