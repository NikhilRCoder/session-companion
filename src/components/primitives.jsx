import { theme, fontSerif, fontSans } from "../theme.js";
import { vibrate } from "../storage.js";

export function Eyebrow({ children, tone = "sage" }) {
  return (
    <p
      style={{
        fontFamily: fontSans,
        fontSize: 11,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: tone === "sage" ? theme.sageDim : theme.roseDim,
        fontWeight: 700,
        marginBottom: 6,
      }}
    >
      {children}
    </p>
  );
}

export function StepDots({ total, index }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 24 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === index ? 18 : 6,
            height: 6,
            borderRadius: 3,
            background: i === index ? theme.sage : i < index ? theme.sageDim : theme.line,
            transition: "all .25s",
          }}
        />
      ))}
    </div>
  );
}

export function OptionButton({ label, selected, onTap, tone = "sage" }) {
  const accent = tone === "rose" ? theme.rose : theme.sage;
  return (
    <button
      onClick={() => {
        vibrate();
        onTap();
      }}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "17px 20px",
        borderRadius: 16,
        border: selected ? `1.5px solid ${accent}` : `1.5px solid ${theme.line}`,
        background: selected ? `${accent}1a` : theme.bgCard,
        color: selected ? accent : theme.bone,
        fontFamily: fontSans,
        fontSize: 15.5,
        fontWeight: 600,
        marginBottom: 10,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all .15s",
      }}
    >
      <span>{label}</span>
      {selected && <span style={{ fontSize: 14 }}>✓</span>}
    </button>
  );
}

const BUTTON_TONES = {
  sage: { bg: `linear-gradient(135deg, ${theme.sage}, ${theme.sageDim})`, fg: theme.sageDeep },
  rose: { bg: `linear-gradient(135deg, ${theme.rose}, ${theme.roseDim})`, fg: theme.roseDeep },
  gold: { bg: `linear-gradient(135deg, ${theme.gold}, #95702f)`, fg: "#241404" },
  ghost: { bg: "transparent", fg: theme.fade },
  danger: { bg: "transparent", fg: theme.danger },
};

export function PrimaryButton({ children, onTap, disabled, tone = "sage", style = {} }) {
  const t = BUTTON_TONES[tone];
  return (
    <button
      onClick={() => !disabled && (vibrate(12), onTap())}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "18px",
        borderRadius: 18,
        border:
          tone === "ghost" || tone === "danger"
            ? `1.5px solid ${tone === "danger" ? "#3a2420" : theme.line}`
            : "none",
        background: disabled ? theme.line : t.bg,
        color: disabled ? theme.faint : t.fg,
        fontFamily: fontSans,
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: 0.2,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: theme.bgCard,
        border: `1px solid ${theme.line}`,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function StatRow({ label, value, valueColor }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
      <span style={{ fontFamily: fontSans, color: theme.faint, fontSize: 13.5 }}>{label}</span>
      <span style={{ fontFamily: fontSans, color: valueColor || theme.bone, fontSize: 13.5, fontWeight: 600 }}>
        {value}
      </span>
    </div>
  );
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      style={{
        width: "100%",
        background: theme.bgCard,
        border: `1.5px solid ${theme.line}`,
        borderRadius: 16,
        padding: 16,
        color: theme.bone,
        fontSize: 16,
        fontFamily: fontSans,
        resize: "none",
        boxSizing: "border-box",
        ...props.style,
      }}
    />
  );
}

export function BackLink({ onBack, label = "← Back" }) {
  return (
    <div style={{ paddingTop: 12, marginBottom: 4 }}>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: theme.faint,
          fontFamily: fontSans,
          fontSize: 14,
          padding: "8px 0",
          cursor: "pointer",
        }}
      >
        {label}
      </button>
    </div>
  );
}

export function ProgressBar({ label, pct, tone = "sage", sub }) {
  const accent = tone === "rose" ? theme.rose : tone === "gold" ? theme.gold : theme.sage;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontFamily: fontSans, fontSize: 13, color: theme.bone, fontWeight: 600 }}>{label}</span>
        <span style={{ fontFamily: fontSans, fontSize: 12, color: theme.faint }}>{sub}</span>
      </div>
      <div style={{ height: 7, background: theme.line, borderRadius: 4, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${Math.max(4, pct)}%`,
            background: accent,
            borderRadius: 4,
            transition: "width .4s",
          }}
        />
      </div>
    </div>
  );
}

export function ChoiceChip({ label, selected, onTap, tone = "rose" }) {
  const accent = tone === "sage" ? theme.sage : theme.rose;
  return (
    <button
      onClick={onTap}
      style={{
        padding: "9px 14px",
        borderRadius: 999,
        fontFamily: fontSans,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        border: selected ? `1.5px solid ${accent}` : `1.5px solid ${theme.line}`,
        background: selected ? `${accent}1a` : "transparent",
        color: selected ? accent : theme.fade,
      }}
    >
      {label}
    </button>
  );
}

export function Pill({ children }) {
  return (
    <span
      style={{
        fontFamily: fontSans,
        fontSize: 12.5,
        color: theme.fade,
        background: theme.bgCard,
        border: `1px solid ${theme.line}`,
        borderRadius: 999,
        padding: "6px 13px",
      }}
    >
      {children}
    </span>
  );
}

export function Screen({ children, noBottomPad }) {
  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        padding: `0 20px ${noBottomPad ? 0 : 16}px`,
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}
