import { useState, useRef } from "react";
import { theme, fontSerif, fontSans } from "../theme.js";
import { getPlaces, savePlaces } from "../storage.js";
import { exportBackup, importBackup } from "../backup.js";
import { Screen, BackLink, Eyebrow, Card, PrimaryButton } from "../components/primitives.jsx";

export function SettingsScreen({ onBack }) {
  const [places, setPlaces] = useState(getPlaces());
  const [status, setStatus] = useState("");
  const fileInputRef = useRef(null);

  const removePlace = (place) => {
    const updated = places.filter((p) => p !== place);
    setPlaces(updated);
    savePlaces(updated);
  };

  return (
    <Screen>
      <BackLink onBack={onBack} label="← Home" />
      <h2 style={{ fontFamily: fontSerif, fontSize: 27, fontWeight: 600, color: theme.bone, marginBottom: 18 }}>
        Settings
      </h2>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Card>
          <Eyebrow>Backup</Eyebrow>
          <p style={{ fontFamily: fontSans, color: theme.fade, fontSize: 13.5, marginTop: 6, marginBottom: 14, lineHeight: 1.6 }}>
            Your data autosaves on this device automatically. Export a backup file to move it elsewhere or keep an
            archive.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <PrimaryButton tone="sage" onTap={exportBackup}>
              Export Backup (.json)
            </PrimaryButton>
            <PrimaryButton tone="ghost" onTap={() => fileInputRef.current?.click()}>
              Import Backup
            </PrimaryButton>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) importBackup(file, (ok) => setStatus(ok ? "Imported — reload to see changes." : "Import failed — check the file."));
              }}
            />
            {status && (
              <p style={{ fontFamily: fontSans, fontSize: 12.5, color: theme.sage, textAlign: "center" }}>{status}</p>
            )}
          </div>
        </Card>
        <Card>
          <Eyebrow tone="rose">Saved Places</Eyebrow>
          {places.length === 0 ? (
            <p style={{ fontFamily: fontSans, color: theme.faint, fontSize: 13, marginTop: 8 }}>None yet.</p>
          ) : (
            <div style={{ marginTop: 10 }}>
              {places.map((place) => (
                <div key={place} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                  <span style={{ fontFamily: fontSans, color: theme.bone, fontSize: 14 }}>{place}</span>
                  <button
                    onClick={() => removePlace(place)}
                    style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", fontSize: 13 }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Screen>
  );
}
