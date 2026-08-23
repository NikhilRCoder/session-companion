import { theme, fontDisplay, fontSans, fontMono, chamfer, chamferTL } from "../theme.js";
import { vibrate } from "../storage.js";

export function Screen({ children, noBottomPad }) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        paddingBottom: noBottomPad ? 0 : 8,
      }}
    >
      {children}
    </div>
  );
}

// Small rotated-square bullet, the recurring motif next to section labels.
export function Dia({ ink, style = {} }) {
  return (
    <span
      style={{
        width: 8,
        height: 8,
        background: ink ? theme.ink : theme.accent,
        transform: "rotate(45deg)",
        flex: "none",
        display: "inline-block",
        ...style,
      }}
    />
  );
}

// Diagonal accent hatch, used as a decorative field inside header slabs.
export function Hatch({ style = {} }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 130,
        height: "100%",
        pointerEvents: "none",
        opacity: 0.5,
        background: `repeating-linear-gradient(-45deg, ${theme.accent} 0 3px, transparent 3px 11px)`,
        clipPath: "polygon(50px 0, 100% 0, 100% 100%, 0 100%)",
        ...style,
      }}
    />
  );
}

// Outlined rotated-square ornament, used as a faint corner accent.
export function Ring({ style = {} }) {
  return (
    <span
      style={{
        position: "absolute",
        border: "2px solid currentColor",
        opacity: 0.4,
        transform: "rotate(45deg)",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

// Section header: diamond + uppercase label + rule, optional right-aligned hint.
export function SectionRule({ children, hint, ink, style = {} }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11, ...style }}>
      <Dia ink={ink} />
      <span
        style={{
          fontFamily: fontDisplay,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: theme.ink,
          flexShrink: 0,
        }}
      >
        {children}
      </span>
      <span style={{ flex: 1, height: 2, background: theme.ink }} />
      {hint && (
        <span
          style={{ fontFamily: fontSans, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: theme.n600, flexShrink: 0 }}
        >
          {hint}
        </span>
      )}
    </div>
  );
}

// Dark or accent-filled header block, used at the top of every screen.
export function Slab({ children, accent, style = {} }) {
  return (
    <div
      style={{
        flex: "none",
        position: "relative",
        overflow: "hidden",
        background: accent ? theme.accent : theme.n900,
        color: theme.surface,
        padding: "18px 20px 24px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Body({ children, style = {} }) {
  return (
    <div style={{ flex: 1, padding: "24px 20px 20px", display: "flex", flexDirection: "column", gap: 26, ...style }}>
      {children}
    </div>
  );
}

export function Foot({ children, style = {} }) {
  return (
    <div
      style={{
        position: "sticky",
        bottom: 0,
        background: theme.bg,
        padding: "14px 20px 20px",
        borderTop: `2px solid ${theme.ink}`,
        zIndex: 2,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Wrap({ children, style = {} }) {
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 8, ...style }}>{children}</div>;
}

export function IconBtn({ children, onTap, label, cornerTL, style = {} }) {
  return (
    <button
      onClick={() => {
        vibrate();
        onTap?.();
      }}
      aria-label={label}
      style={{
        width: 36,
        height: 36,
        flex: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "2px solid currentColor",
        color: "inherit",
        cursor: "pointer",
        padding: 0,
        clipPath: cornerTL ? chamferTL(12) : chamfer(12),
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// Back arrow + kicker label + optional "N/M" step counter, for slab headers.
export function SlabHead({ kicker, step, onBack }) {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
      {onBack && (
        <IconBtn onTap={onBack} label="Back" cornerTL>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </IconBtn>
      )}
      <span
        style={{
          fontFamily: fontDisplay,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: theme.n400,
        }}
      >
        {kicker}
      </span>
      {step && (
        <span style={{ fontFamily: fontDisplay, fontSize: 30, fontWeight: 700, lineHeight: 1, fontVariantNumeric: "tabular-nums", marginLeft: "auto" }}>
          <span style={{ color: theme.accent }}>{step[0]}</span>
          <span style={{ color: theme.n600 }}>/{step[1]}</span>
        </span>
      )}
    </div>
  );
}

const CHIP_SIZES = {
  md: { padding: "10px 15px", fontSize: 13, cut: 9 },
  grow: { padding: "14px 0", fontSize: 17, cut: 12 },
  sm: { padding: "8px 12px", fontSize: 12, cut: 8 },
};

export function Chip({ label, selected, onTap, size = "md", grow, style = {} }) {
  const s = CHIP_SIZES[size];
  return (
    <button
      onClick={() => {
        vibrate();
        onTap();
      }}
      style={{
        padding: s.padding,
        border: `2px solid ${selected ? theme.accent : theme.ink}`,
        background: selected ? theme.accent : "transparent",
        color: selected ? theme.surface : theme.ink,
        fontFamily: fontDisplay,
        fontSize: s.fontSize,
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        cursor: "pointer",
        lineHeight: 1.15,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: grow || size === "grow" ? "center" : "flex-start",
        flex: grow || size === "grow" ? 1 : undefined,
        clipPath: chamfer(s.cut),
        ...style,
      }}
    >
      {label}
    </button>
  );
}

const CTA_TONES = {
  accent: { bg: theme.accent, fg: theme.surface, border: "none" },
  ink: { bg: theme.n900, fg: theme.surface, border: "none" },
  ghost: { bg: "transparent", fg: theme.ink, border: `2px solid ${theme.ink}` },
  danger: { bg: "transparent", fg: theme.accent700, border: `2px solid ${theme.accent700}` },
};

export function Cta({ children, onTap, disabled, tone = "accent", style = {} }) {
  const t = CTA_TONES[tone];
  return (
    <button
      onClick={() => !disabled && (vibrate(12), onTap())}
      disabled={disabled}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        textAlign: "left",
        border: disabled ? `2px solid ${theme.n500}` : t.border,
        padding: "18px 20px",
        cursor: disabled ? "not-allowed" : "pointer",
        background: disabled ? "transparent" : t.bg,
        color: disabled ? theme.n500 : t.fg,
        fontFamily: fontDisplay,
        fontSize: 18,
        fontWeight: 700,
        textTransform: "uppercase",
        clipPath: chamfer(14),
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
        background: theme.surface,
        border: `2px solid ${theme.ink}`,
        padding: 16,
        marginBottom: 12,
        clipPath: chamfer(16),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function StatRow({ label, value, valueColor }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "4px 0" }}>
      <span style={{ fontFamily: fontSans, color: theme.n600, fontSize: 13.5 }}>{label}</span>
      <span style={{ fontFamily: fontMono, color: valueColor || theme.ink, fontSize: 13, fontWeight: 700, textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}

// 2-column grid of vertical key/value pairs with ink dividers, matching the
// prototype's `.stats` block.
export function StatsGrid({ children, style = {} }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 2,
        background: theme.ink,
        border: `2px solid ${theme.ink}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function StatBox({ label, value, span }) {
  return (
    <div style={{ background: theme.surface, padding: "14px 14px 16px", gridColumn: span ? `span ${span}` : undefined }}>
      <div style={{ fontFamily: fontSans, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: theme.n600 }}>
        {label}
      </div>
      <div style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 700, lineHeight: 1.05, textTransform: "uppercase", color: theme.ink, marginTop: 5 }}>
        {value}
      </div>
    </div>
  );
}

export function Tag({ children, outlined }) {
  return (
    <span
      style={{
        padding: "6px 11px",
        background: outlined ? "transparent" : theme.accent,
        color: outlined ? theme.ink : theme.surface,
        border: outlined ? `2px solid ${theme.ink}` : "none",
        fontFamily: fontDisplay,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        clipPath: chamfer(8),
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      style={{
        width: "100%",
        background: theme.surface,
        border: `2px solid ${theme.ink}`,
        padding: 14,
        color: theme.ink,
        fontSize: 15,
        fontFamily: fontSans,
        resize: "none",
        boxSizing: "border-box",
        ...props.style,
      }}
    />
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        background: theme.surface,
        border: `2px solid ${theme.ink}`,
        padding: "12px 14px",
        color: theme.ink,
        fontSize: 15,
        fontFamily: fontSans,
        boxSizing: "border-box",
        clipPath: chamfer(12),
        ...props.style,
      }}
    />
  );
}

export function BackLink({ onBack, label = "Back" }) {
  return (
    <div style={{ paddingTop: 12, marginBottom: 4 }}>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: theme.n600,
          fontFamily: fontSans,
          fontSize: 14,
          padding: "8px 0",
          cursor: "pointer",
        }}
      >
        ← {label}
      </button>
    </div>
  );
}

export function ProgressBar({ label, pct, sub }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontFamily: fontSans, fontSize: 13, color: theme.ink, fontWeight: 600 }}>{label}</span>
        <span style={{ fontFamily: fontSans, fontSize: 12, color: theme.n600 }}>{sub}</span>
      </div>
      <div style={{ height: 7, background: theme.n300, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.max(4, pct)}%`, background: theme.accent, transition: "width .4s" }} />
      </div>
    </div>
  );
}
