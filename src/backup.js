import { getSessions, getPeople, getPlaces, getFields, saveSessions, savePeople, savePlaces, saveFields } from "./storage.js";

export function exportBackup() {
  const data = {
    exportedAt: new Date().toISOString(),
    version: 5,
    sessions: getSessions(),
    people: getPeople(),
    places: getPlaces(),
    fields: getFields(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `session-companion-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importBackup(file, callback) {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (data.sessions) saveSessions(data.sessions);
      if (data.people) savePeople(data.people);
      if (data.places) savePlaces(data.places);
      if (data.fields) saveFields(data.fields);
      callback(true);
    } catch {
      callback(false);
    }
  };
  reader.readAsText(file);
}
