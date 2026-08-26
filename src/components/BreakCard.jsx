import { theme, fontSans } from "../theme.js";
import { daysSince } from "../format.js";
import { Card, SectionRule, Cta } from "./primitives.jsx";

const BREAK_MILESTONES = [
  { days: 1, label: "1 Day" },
  { days: 3, label: "3 Days" },
  { days: 7, label: "1 Week" },
  { days: 14, label: "2 Weeks" },
  { days: 30, label: "1 Month" },
  { days: 60, label: "2 Months" },
  { days: 90, label: "3 Months" },
];

export function BreakCard({ breakState, longestPastBreak, onStart, onEnd }) {
  if (!breakState) {
    return (
      <Card>
        <SectionRule ink>Tolerance Break</SectionRule>
        <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 13.5, marginTop: 8, marginBottom: 14, lineHeight: 1.6 }}>
          Taking time off resets your tolerance. Start one to track the streak.
        </p>
        <Cta tone="ghost" onTap={onStart}>
          <span>Start a Break</span>
        </Cta>
      </Card>
    );
  }

  const days = daysSince(breakState.startedAt);
  const reached = [...BREAK_MILESTONES].reverse().find((m) => m.days <= days);
  const next = BREAK_MILESTONES.find((m) => m.days > days);
  const isPersonalBest = typeof longestPastBreak === "number" && days > longestPastBreak;

  return (
    <Card>
      <SectionRule ink>Tolerance Break</SectionRule>
      <p style={{ fontFamily: fontSans, fontSize: 46, fontWeight: 700, color: theme.ink, lineHeight: 1, marginTop: 6 }}>
        {days}
        <span style={{ fontSize: 16, fontWeight: 600, color: theme.n600, marginLeft: 6 }}>day{days === 1 ? "" : "s"}</span>
      </p>
      {reached && (
        <p style={{ fontFamily: fontSans, color: theme.accent700, fontSize: 13, fontWeight: 600, marginTop: 6 }}>
          {reached.label} milestone reached
        </p>
      )}
      {next && (
        <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 12.5, marginTop: 3 }}>
          Next: {next.label} in {next.days - days} day{next.days - days === 1 ? "" : "s"}
        </p>
      )}
      {isPersonalBest && (
        <p style={{ fontFamily: fontSans, color: theme.accent700, fontSize: 12.5, fontWeight: 600, marginTop: 3 }}>
          New personal best
        </p>
      )}
      <div style={{ marginTop: 14 }}>
        <Cta tone="ghost" onTap={onEnd}>
          <span>End Break</span>
        </Cta>
      </div>
    </Card>
  );
}
