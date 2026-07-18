import { theme } from "../theme.js";

const VIEW_WIDTH = 320;
const VIEW_HEIGHT = 140;
const PADDING = 14;

// Sketch of the session's movement path. Renders nothing for fewer than 2 points.
export function TrackSketch({ track }) {
  if (!track || track.length < 2) return null;

  // Equirectangular projection: scale longitude by cos(mid-latitude) so the
  // path's shape isn't stretched east-west.
  const midLat = (track.reduce((s, p) => s + p.lat, 0) / track.length) * (Math.PI / 180);
  const cosLat = Math.cos(midLat);
  const xs = track.map((p) => p.lng * cosLat);
  const ys = track.map((p) => -p.lat);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = maxX - minX || 1e-9;
  const spanY = maxY - minY || 1e-9;
  const scale = Math.min((VIEW_WIDTH - 2 * PADDING) / spanX, (VIEW_HEIGHT - 2 * PADDING) / spanY);
  const offsetX = (VIEW_WIDTH - spanX * scale) / 2;
  const offsetY = (VIEW_HEIGHT - spanY * scale) / 2;

  const points = track.map((_, i) => ({
    x: (xs[i] - minX) * scale + offsetX,
    y: (ys[i] - minY) * scale + offsetY,
  }));
  const path = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const start = points[0];
  const end = points[points.length - 1];

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      role="img"
      aria-label="Sketch of movement during the session"
      style={{ display: "block", marginBottom: 8 }}
    >
      <polyline
        points={path}
        fill="none"
        stroke={theme.sage}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={start.x} cy={start.y} r="6" fill={theme.bgCard} />
      <circle cx={start.x} cy={start.y} r="4" fill={theme.faint} />
      <circle cx={end.x} cy={end.y} r="6" fill={theme.bgCard} />
      <circle cx={end.x} cy={end.y} r="4" fill={theme.gold} />
    </svg>
  );
}
