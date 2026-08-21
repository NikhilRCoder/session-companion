import { useRef } from "react";
import { theme, fontDisplay, fontMono } from "../theme.js";
import { formatDuration } from "../format.js";

export function TimerRing({ elapsedMs }) {
  const reducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ).current;
  const phase = (elapsedMs / 1e3) % 4;
  // pathLength=100 lets the dash animate in percentage terms around the square frame.
  const dash = reducedMotion ? 75 : 62 + 13 * Math.sin((phase / 4) * Math.PI * 2);

  return (
    <div style={{ position: "relative", width: 220, height: 220, margin: "0 auto" }}>
      <svg width="220" height="220" viewBox="0 0 220 220">
        <rect x="10" y="10" width="200" height="200" fill="none" stroke={theme.line} strokeWidth="2" />
        <rect
          x="10"
          y="10"
          width="200"
          height="200"
          fill="none"
          stroke={theme.gold}
          strokeWidth="2"
          pathLength="100"
          strokeDasharray={`${dash} 100`}
          style={{
            transition: reducedMotion ? "none" : "stroke-dasharray 1s linear",
            filter: `drop-shadow(0 0 5px ${theme.gold}99)`,
          }}
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
            fontFamily: fontDisplay,
            fontSize: 38,
            fontWeight: 700,
            color: theme.bone,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: -1,
          }}
        >
          {formatDuration(elapsedMs)}
        </span>
        <span
          style={{
            fontFamily: fontMono,
            fontSize: 10,
            color: theme.faint,
            letterSpacing: 2,
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
