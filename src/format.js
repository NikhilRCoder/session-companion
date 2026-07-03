export const formatDuration = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1e3));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${minutes}:${String(seconds).padStart(2, "0")}`;
};

export const formatTime = (dateLike) =>
  new Date(dateLike).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const formatDate = (dateLike) =>
  new Date(dateLike).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

export const daysSince = (dateLike) =>
  Math.floor((Date.now() - new Date(dateLike).getTime()) / 864e5);

export const isSameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();
