import { theme, fontDisplay } from "../theme.js";
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
        borderTop: `2px solid ${theme.ink}`,
        background: theme.surface,
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
          <span style={{ fontSize: 17, color: active === tab.id ? theme.accent : theme.n500 }}>{tab.icon}</span>
          <span
            style={{
              fontFamily: fontDisplay,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: active === tab.id ? theme.accent : theme.n500,
            }}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}
