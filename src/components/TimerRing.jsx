import { useRef } from "react";
import { theme, fontSerif, fontSans } from "../theme.js";
import { formatDuration } from "../format.js";

export function TimerRing({ elapsedMs }) {
  const reducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ).current;
  const radius = 92;
  const circumference = 2 * Math.PI * radius;
  const phase = (elapsedMs / 1e3) % 4;
  const dash = reducedMotion
    ? circumference * 0.75
    : circumference * (0.62 + 0.13 * Math.sin((phase / 4) * Math.PI * 2));

  return (
    <div style={{ position: "relative", width: 220, height: 220, margin: "0 auto" }}>
      <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="110" cy="110" r={radius} fill="none" stroke={theme.line} strokeWidth="3" />
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke={theme.gold}
          strokeWidth="3"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: reducedMotion ? "none" : "stroke-dasharray 1s linear" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: fontSerif,
            fontSize: 38,
            fontWeight: 600,
            color: theme.bone,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: -1,
          }}
        >
          {formatDuration(elapsedMs)}
        </span>
        <span
          style={{
            fontFamily: fontSans,
            fontSize: 11,
            color: theme.faint,
            letterSpacing: 1.5,
            marginTop: 4,
            textTransform: "uppercase",
          }}
        >
          elapsed
        </span>
      </div>
    </div>
  );
}
