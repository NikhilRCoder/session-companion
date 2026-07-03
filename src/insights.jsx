import { theme, fontSans } from "./theme.js";
import { formatDuration, daysSince, isSameDay, isSameMonth } from "./format.js";
import { ProgressBar } from "./components/primitives.jsx";

const POSITIVE_MOODS = ["Zen", "Vibing", "Connected", "Energized"];
const NEGATIVE_MOODS = ["Overwhelmed"];

const tally = (values) => values.reduce((acc, v) => ((acc[v] = (acc[v] || 0) + 1), acc), {});
const topEntry = (counts) => Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

export function computeInsights(sessions, people) {
  if (sessions.length === 0) return { cards: [], nudges: [] };

  const completed = sessions.filter((s) => s.endTime);
  const formatCounts = tally(completed.map((s) => s.format).filter(Boolean));
  const avgDurationMs = completed.length
    ? completed.reduce((sum, s) => sum + (new Date(s.endTime) - new Date(s.startTime)), 0) / completed.length
    : 0;

  const moodBySetting = {};
  completed.forEach((s) => {
    if (!s.setting) return;
    const netMood =
      (s.moodsPost || []).filter((m) => POSITIVE_MOODS.includes(m)).length -
      (s.moodsPost || []).filter((m) => NEGATIVE_MOODS.includes(m)).length;
    moodBySetting[s.setting] = moodBySetting[s.setting] || { sum: 0, n: 0 };
    moodBySetting[s.setting].sum += netMood;
    moodBySetting[s.setting].n++;
  });
  const bestSetting = Object.entries(moodBySetting)
    .map(([setting, stat]) => [setting, stat.sum / stat.n])
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
      tone: "sage",
      detail: <ProgressBar label="Last 7 days" pct={Math.min(100, thisWeekCount * 14)} sub={`${thisWeekCount}/7`} />,
    },
    {
      id: "format",
      title: "Most Common Format",
      value: topEntry(formatCounts)?.[0] || "—",
      tone: "sage",
      detail: Object.entries(formatCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([format, count]) => (
          <ProgressBar key={format} label={format} pct={(count / completed.length) * 100} sub={`${count}`} />
        )),
    },
    {
      id: "setting",
      title: "Best Mood Setting",
      value: bestSetting?.[0] || "—",
      tone: "rose",
      detail: (
        <p style={{ fontFamily: fontSans, color: theme.fade, fontSize: 13.5, lineHeight: 1.6 }}>
          Sessions in <strong style={{ color: theme.bone }}>{bestSetting?.[0] || "—"}</strong> trend toward your most
          positive post-session moods.
        </p>
      ),
    },
    {
      id: "duration",
      title: "Average Duration",
      value: formatDuration(avgDurationMs),
      tone: "gold",
      detail: (
        <p style={{ fontFamily: fontSans, color: theme.fade, fontSize: 13.5, lineHeight: 1.6 }}>
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
      tone: "rose",
      detail: Object.entries(peopleStats).map(([personId, stat]) => {
        const name = people.find((p) => p.id === personId)?.name || "Unknown";
        return (
          <ProgressBar key={personId} label={name} pct={(stat.good / stat.total) * 100} sub={`${stat.good}/${stat.total} good`} tone="rose" />
        );
      }),
    });
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
      tone: "gold",
      detail: (
        <p style={{ fontFamily: fontSans, color: theme.fade, fontSize: 13.5, lineHeight: 1.6 }}>
          ${monthTotal.toFixed(2)} this month across {thisMonthSessions.length} session{thisMonthSessions.length === 1 ? "" : "s"}.
        </p>
      ),
    });
  }

  const nudges = [];
  if (thisWeekCount >= 5) {
    nudges.push({ tone: "rose", text: `${thisWeekCount} sessions in the last 7 days — might be worth a deliberate day off.` });
  }
  if (daysSinceLast !== null && daysSinceLast === 0 && completed.length >= 2) {
    const todayCount = completed.filter((s) => isSameDay(s.startTime, new Date())).length;
    if (todayCount >= 2) nudges.push({ tone: "rose", text: `${todayCount} sessions today already.` });
  }
  if (completed.length >= 15) {
    nudges.push({ tone: "sage", text: `You have enough history (${completed.length} sessions) for pattern predictions to start being reliable.` });
  } else {
    nudges.push({ tone: "sage", text: `${15 - completed.length} more sessions until predictions get more reliable.` });
  }

  return { cards, nudges };
}
