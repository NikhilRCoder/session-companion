export const KEYS = {
  log: "sc_sessions_v3",
  people: "sc_people_v3",
  places: "sc_places_v3",
  live: "sc_live_v3",
  fields: "sc_fields_v1",
};

export const safeStorage = {
  get: (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};

export const getSessions = () => {
  const sessions = safeStorage.get(KEYS.log, []);
  let mutated = false;
  const withIds = sessions.map((s) => {
    if (s.id) return s;
    mutated = true;
    return { ...s, id: makeId() };
  });
  if (mutated) saveSessions(withIds);
  return withIds;
};
export const saveSessions = (sessions) => safeStorage.set(KEYS.log, sessions);

export const getPeople = () => safeStorage.get(KEYS.people, []);
export const savePeople = (people) => safeStorage.set(KEYS.people, people);

export const getPlaces = () => safeStorage.get(KEYS.places, []);
export const savePlaces = (places) => safeStorage.set(KEYS.places, places);

export const getFields = () => safeStorage.get(KEYS.fields, []);
export const saveFields = (fields) => safeStorage.set(KEYS.fields, fields);

export const getLiveSession = () => safeStorage.get(KEYS.live, null);
export const setLiveSession = (value) =>
  value === null ? localStorage.removeItem(KEYS.live) : safeStorage.set(KEYS.live, value);

export const vibrate = (pattern = 8) => {
  try {
    navigator.vibrate?.(pattern);
  } catch {}
};

export const makeId = () => Math.random().toString(36).slice(2, 10);
