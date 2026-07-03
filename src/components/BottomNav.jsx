import { theme, fontSans } from "../theme.js";
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
        display: "flex",
        borderTop: `1px solid ${theme.line}`,
        background: theme.bg,
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        paddingTop: 8,
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
            flex: 1,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <span style={{ fontSize: 17, color: active === tab.id ? theme.sage : theme.faint }}>{tab.icon}</span>
          <span
            style={{
              fontFamily: fontSans,
              fontSize: 10.5,
              fontWeight: 600,
              color: active === tab.id ? theme.sage : theme.faint,
              letterSpacing: 0.3,
            }}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}
