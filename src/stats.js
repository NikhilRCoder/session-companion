const DAY_MS = 86400e3;

const dayKey = (d) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
};

const startOfDay = (d) => {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt;
};

export function daysSinceLast(sessions, now = new Date()) {
  if (!sessions.length) return null;
  const last = sessions.reduce((max, s) => (s.startTime > max ? s.startTime : max), sessions[0].startTime);
  return Math.max(0, Math.round((startOfDay(now) - startOfDay(last)) / DAY_MS));
}

// Longest gap in whole days between consecutive session days (including the
// ongoing gap since the last session).
export function longestBreak(sessions, now = new Date()) {
  if (!sessions.length) return null;
  const days = [...new Set(sessions.map((s) => startOfDay(s.startTime).getTime()))].sort((a, b) => a - b);
  let longest = 0;
  for (let i = 1; i < days.length; i++) longest = Math.max(longest, (days[i] - days[i - 1]) / DAY_MS);
  return Math.round(Math.max(longest, (startOfDay(now) - days[days.length - 1]) / DAY_MS));
}

export function countSince(sessions, days, now = new Date()) {
  const cutoff = now.getTime() - days * DAY_MS;
  return sessions.filter((s) => new Date(s.startTime).getTime() >= cutoff).length;
}

export function avgPerWeek(sessions, weeks = 4, now = new Date()) {
  return countSince(sessions, weeks * 7, now) / weeks;
}

// Per-day session counts for the trailing `days` days, oldest first, aligned so
// the final week ends today: [{date, count}, ...].
export function dayCounts(sessions, days = 84, now = new Date()) {
  const counts = new Map();
  for (const s of sessions) {
    const key = dayKey(s.startTime);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const out = [];
  const today = startOfDay(now);
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today.getTime() - i * DAY_MS);
    out.push({ date, count: counts.get(dayKey(date)) || 0 });
  }
  return out;
}
