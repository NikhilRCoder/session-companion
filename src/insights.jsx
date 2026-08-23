import { theme, fontSans } from "./theme.js";
import { formatDuration, daysSince, isSameDay, isSameMonth } from "./format.js";
import { ProgressBar } from "./components/primitives.jsx";
import { MoodTrendChart } from "./components/MoodTrendChart.jsx";

const POSITIVE_EFFECTS = ["Relaxed", "Euphoric", "Focused", "Creative", "Giggly"];
const NEGATIVE_SIDE_EFFECTS = ["Anxiety", "Racing heart", "Paranoia", "Dizziness", "Nausea"];
const OLD_POSITIVE_MOODS = ["Zen", "Vibing", "Connected", "Energized"];
const OLD_NEGATIVE_MOODS = ["Overwhelmed"];

function netMood(session) {
  if (session.effects || session.sideEffects) {
    const pos = (session.effects || []).filter((m) => POSITIVE_EFFECTS.includes(m)).length;
    const neg = (session.sideEffects || []).filter((m) => NEGATIVE_SIDE_EFFECTS.includes(m)).length;
    return pos - neg;
  }
  if (session.moodsPost) {
    return session.moodsPost.filter((m) => OLD_POSITIVE_MOODS.includes(m)).length - session.moodsPost.filter((m) => OLD_NEGATIVE_MOODS.includes(m)).length;
  }
  return 0;
}
const hasMoodSignal = (session) => Boolean(session.effects?.length || session.sideEffects?.length || session.moodsPost?.length);

const tally = (values) => values.reduce((acc, v) => ((acc[v] = (acc[v] || 0) + 1), acc), {});
const topEntry = (counts) => Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

function computeMoodTrend(completed, weeks = 8) {
  const buckets = Array.from({ length: weeks }, () => ({ sum: 0, n: 0 }));
  completed.forEach((s) => {
    if (!hasMoodSignal(s)) return;
    const weeksAgo = Math.floor(daysSince(s.startTime) / 7);
    if (weeksAgo < 0 || weeksAgo >= weeks) return;
    const bucket = buckets[weeks - 1 - weeksAgo];
    bucket.sum += netMood(s);
    bucket.n++;
  });
  return buckets.map((b) => (b.n ? b.sum / b.n : null));
}

export function computeInsights(sessions, people) {
  if (sessions.length === 0) return { cards: [], nudges: [] };

  const completed = sessions.filter((s) => s.endTime);
  const methodCounts = tally(completed.map((s) => s.method || s.format).filter(Boolean));
  const avgDurationMs = completed.length
    ? completed.reduce((sum, s) => sum + (new Date(s.endTime) - new Date(s.startTime)), 0) / completed.length
    : 0;

  const moodByEnvironment = {};
  completed.forEach((s) => {
    const env = s.environment || s.setting;
    if (!env || !hasMoodSignal(s)) return;
    moodByEnvironment[env] = moodByEnvironment[env] || { sum: 0, n: 0 };
    moodByEnvironment[env].sum += netMood(s);
    moodByEnvironment[env].n++;
  });
  const bestEnvironment = Object.entries(moodByEnvironment)
    .map(([env, stat]) => [env, stat.sum / stat.n])
    .sort((a, b) => b[1] - a[1])[0];

  const peopleStats = {};
  completed.forEach((s) => {
    (s.peopleIds || []).forEach((personId) => {
      const quality = s.interactionQuality?.[personId];
      peopleStats[personId] = peopleStats[personId] || { good: 0, neutral: 0, off: 0, total: 0 };
      peopleStats[personId].total++;
      if (quality === "Felt good") peopleStats[personId].good++;
      else if (quality === "Felt off") peopleStats[personId].off++;
      else if (quality === "Neutral") peopleStats[personId].neutral++;
    });
  });

  const thisWeekCount = completed.filter((s) => daysSince(s.startTime) < 7).length;
  const daysSinceLast = completed.length ? daysSince(completed[0].startTime) : null;

  const cards = [
    {
      id: "freq",
      title: "This Week",
      value: `${thisWeekCount} session${thisWeekCount === 1 ? "" : "s"}`,
      tone: "accent",
      detail: <ProgressBar label="Last 7 days" pct={Math.min(100, thisWeekCount * 14)} sub={`${thisWeekCount}/7`} />,
    },
    {
      id: "method",
      title: "Most Common Method",
      value: topEntry(methodCounts)?.[0] || "—",
      tone: "accent",
      detail: Object.entries(methodCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([method, count]) => <ProgressBar key={method} label={method} pct={(count / completed.length) * 100} sub={`${count}`} />),
    },
    {
      id: "environment",
      title: "Best Mood Environment",
      value: bestEnvironment?.[0] || "—",
      tone: "accent",
      detail: (
        <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 13.5, lineHeight: 1.6 }}>
          Sessions <strong style={{ color: theme.ink }}>{bestEnvironment?.[0] || "—"}</strong> trend toward your most positive post-session effects.
        </p>
      ),
    },
    {
      id: "duration",
      title: "Average Duration",
      value: formatDuration(avgDurationMs),
      tone: "accent",
      detail: (
        <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 13.5, lineHeight: 1.6 }}>
          Across {completed.length} completed session{completed.length === 1 ? "" : "s"}.
        </p>
      ),
    },
  ];

  if (Object.keys(peopleStats).length > 0) {
    cards.push({
      id: "people",
      title: "People Patterns",
      value: `${Object.keys(peopleStats).length} tracked`,
      tone: "accent",
      detail: Object.entries(peopleStats).map(([personId, stat]) => {
        const name = people.find((p) => p.id === personId)?.name || "Unknown";
        return <ProgressBar key={personId} label={name} pct={(stat.good / stat.total) * 100} sub={`${stat.good}/${stat.total} good`} />;
      }),
    });
  }

  const moodTrend = computeMoodTrend(completed);
  const moodTrendSignal = moodTrend.filter((v) => v !== null);
  if (moodTrendSignal.length >= 2) {
    const direction =
      moodTrendSignal[moodTrendSignal.length - 1] > moodTrendSignal[0] ? "Improving" : moodTrendSignal[moodTrendSignal.length - 1] < moodTrendSignal[0] ? "Declining" : "Steady";
    cards.push({ id: "moodTrend", title: "Mood Trend", value: direction, tone: "accent", detail: <MoodTrendChart values={moodTrend} /> });
  }

  const costSessions = completed.filter((s) => typeof s.cost === "number");
  if (costSessions.length > 0) {
    const avgCost = costSessions.reduce((sum, s) => sum + s.cost, 0) / costSessions.length;
    const thisMonthSessions = costSessions.filter((s) => isSameMonth(s.startTime, new Date()));
    const monthTotal = thisMonthSessions.reduce((sum, s) => sum + s.cost, 0);
    cards.push({
      id: "spend",
      title: "Average Spend",
      value: `$${avgCost.toFixed(2)}`,
      tone: "accent",
      detail: (
        <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 13.5, lineHeight: 1.6 }}>
          ${monthTotal.toFixed(2)} this month across {thisMonthSessions.length} session{thisMonthSessions.length === 1 ? "" : "s"}.
        </p>
      ),
    });
  }

  const nudges = [];
  if (thisWeekCount >= 5) nudges.push({ text: `${thisWeekCount} sessions in the last 7 days — might be worth a deliberate day off.` });
  if (daysSinceLast !== null && daysSinceLast === 0 && completed.length >= 2) {
    const todayCount = completed.filter((s) => isSameDay(s.startTime, new Date())).length;
    if (todayCount >= 2) nudges.push({ text: `${todayCount} sessions today already.` });
  }
  if (completed.length >= 15) {
    nudges.push({ text: `You have enough history (${completed.length} sessions) for pattern predictions to start being reliable.` });
  } else {
    nudges.push({ text: `${15 - completed.length} more sessions until predictions get more reliable.` });
  }

  return { cards, nudges };
}
