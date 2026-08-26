import { useState, useRef } from "react";
import { theme, fontDisplay, fontSans } from "../theme.js";
import { getPlaces, savePlaces, getLockState } from "../storage.js";
import { exportBackup, importBackup } from "../backup.js";
import { Screen, Slab, SlabHead, Body, SectionRule, Card, Cta } from "../components/primitives.jsx";
import { CustomFieldsCard } from "./CustomFieldsCard.jsx";

export function SettingsScreen({ onBack, onManageLock }) {
  const [places, setPlaces] = useState(getPlaces());
  const lockState = getLockState();
  const [status, setStatus] = useState("");
  const fileInputRef = useRef(null);

  const removePlace = (place) => {
    const updated = places.filter((p) => p !== place);
    setPlaces(updated);
    savePlaces(updated);
  };

  return (
    <Screen noBottomPad>
      <Slab>
        <SlabHead kicker="Settings" onBack={onBack} />
        <h2 style={{ fontFamily: fontDisplay, fontSize: 32, fontWeight: 700, textTransform: "uppercase", marginTop: 16, position: "relative" }}>
          Settings
        </h2>
      </Slab>
      <Body>
        <Card>
          <SectionRule ink>Backup</SectionRule>
          <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 13.5, marginTop: 6, marginBottom: 14, lineHeight: 1.6 }}>
            Your data autosaves on this device automatically. Export a backup file to move it elsewhere or keep an archive.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Cta onTap={exportBackup}>
              <span>Export Backup (.json)</span>
            </Cta>
            <Cta tone="ghost" onTap={() => fileInputRef.current?.click()}>
              <span>Import Backup</span>
            </Cta>
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
            {status && <p style={{ fontFamily: fontSans, fontSize: 12.5, color: theme.accent700, textAlign: "center" }}>{status}</p>}
          </div>
        </Card>
        <Card>
          <SectionRule ink>App Lock</SectionRule>
          <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 13.5, marginTop: 6, marginBottom: 14, lineHeight: 1.6 }}>
            {lockState?.enabled ? "On — a PIN is required each time you return to the app." : "Off — require a 4-digit PIN to open the app."}
          </p>
          <Cta tone="ghost" onTap={onManageLock}>
            <span>Manage</span>
          </Cta>
        </Card>
        <CustomFieldsCard />
        <Card>
          <SectionRule ink>Saved Places</SectionRule>
          {places.length === 0 ? (
            <p style={{ fontFamily: fontSans, color: theme.n500, fontSize: 13, marginTop: 8 }}>None yet.</p>
          ) : (
            <div style={{ marginTop: 10 }}>
              {places.map((place) => (
                <div key={place} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                  <span style={{ fontFamily: fontSans, color: theme.ink, fontSize: 14 }}>{place}</span>
                  <button onClick={() => removePlace(place)} style={{ background: "none", border: "none", color: theme.accent700, cursor: "pointer", fontSize: 13, fontFamily: fontSans }}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </Body>
    </Screen>
  );
}
