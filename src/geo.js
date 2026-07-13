const round5 = (n) => Math.round(n * 1e5) / 1e5;

// Best-effort location fix. Resolves {lat, lng, accuracy} or null — never rejects.
export function captureLocation({ timeoutMs = 10000, maximumAgeMs = 300000 } = {}) {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: round5(pos.coords.latitude),
          lng: round5(pos.coords.longitude),
          accuracy: Math.round(pos.coords.accuracy),
        }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: maximumAgeMs }
    );
  });
}

export function distanceMeters(a, b) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Nearest place name from past sessions logged close to these coords.
export function nearestKnownPlace(sessions, coords, maxMeters = 150) {
  let best = null;
  sessions.forEach((s) => {
    if (!s.location || !s.place) return;
    const distance = distanceMeters(s.location, coords);
    if (distance <= maxMeters && (!best || distance < best.distance)) {
      best = { place: s.place, distance };
    }
  });
  return best;
}

export function formatCoords({ lat, lng, accuracy }) {
  const decimals = accuracy > 500 ? 2 : accuracy > 50 ? 3 : 4;
  return `${lat.toFixed(decimals)}, ${lng.toFixed(decimals)}`;
}
