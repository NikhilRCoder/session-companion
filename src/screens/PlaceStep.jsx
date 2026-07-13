import { useState } from "react";
import { theme, fontSerif, fontSans } from "../theme.js";
import { getPlaces, savePlaces, getSessions } from "../storage.js";
import { nearestKnownPlace } from "../geo.js";
import { Screen, BackLink, Eyebrow, PrimaryButton } from "../components/primitives.jsx";

export function PlaceStep({ place, setPlace, cost, setCost, sessionLocation, onBack, onNext }) {
  const [places, setPlaces] = useState(getPlaces());
  const [input, setInput] = useState(place || "");
  const [costInput, setCostInput] = useState(typeof cost === "number" ? String(cost) : "");
  const [suggestion] = useState(() =>
    sessionLocation ? nearestKnownPlace(getSessions(), sessionLocation) : null
  );

  const pickPlace = (name) => {
    setPlace(name);
    setInput(name);
  };

  const confirm = () => {
    const trimmed = input.trim();
    if (trimmed && !places.includes(trimmed)) {
      const updated = [...places, trimmed];
      setPlaces(updated);
      savePlaces(updated);
    }
    setPlace(trimmed);
    setCost(costInput.trim() === "" ? undefined : Number(costInput));
    onNext();
  };

  return (
    <Screen>
      <BackLink onBack={onBack} />
      <div style={{ marginBottom: 22, textAlign: "center" }}>
        <span style={{ fontSize: 28, color: theme.roseDim, display: "block", marginBottom: 10 }}>⌖</span>
        <Eyebrow tone="rose">Checking In</Eyebrow>
        <h2 style={{ fontFamily: fontSerif, fontSize: 25, fontWeight: 600, color: theme.bone }}>
          Where was this? <span style={{ color: theme.faint, fontSize: 15, fontFamily: fontSans }}>(optional)</span>
        </h2>
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a place name..."
        style={{
          width: "100%",
          background: theme.bgCard,
          border: `1.5px solid ${theme.line}`,
          borderRadius: 16,
          padding: "16px 18px",
          color: theme.bone,
          fontSize: 16,
          fontFamily: fontSans,
          boxSizing: "border-box",
          marginBottom: 14,
        }}
      />
      <input
        value={costInput}
        onChange={(e) => setCostInput(e.target.value)}
        placeholder="Amount spent (optional)"
        type="number"
        inputMode="decimal"
        step="0.01"
        min="0"
        style={{
          width: "100%",
          background: theme.bgCard,
          border: `1.5px solid ${theme.line}`,
          borderRadius: 16,
          padding: "16px 18px",
          color: theme.bone,
          fontSize: 16,
          fontFamily: fontSans,
          boxSizing: "border-box",
          marginBottom: 14,
        }}
      />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {suggestion && !input && (
          <div style={{ marginBottom: 14 }}>
            <Eyebrow tone="rose">Near your usual spot</Eyebrow>
            <button
              onClick={() => pickPlace(suggestion.place)}
              style={{
                padding: "9px 14px",
                borderRadius: 999,
                fontFamily: fontSans,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                border: `1.5px solid ${theme.rose}`,
                background: `${theme.rose}1a`,
                color: theme.rose,
              }}
            >
              {suggestion.place}
            </button>
          </div>
        )}
        {places.length > 0 && <Eyebrow tone="rose">Saved Places</Eyebrow>}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {places.map((name) => (
            <button
              key={name}
              onClick={() => pickPlace(name)}
              style={{
                padding: "9px 14px",
                borderRadius: 999,
                fontFamily: fontSans,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                border: input === name ? `1.5px solid ${theme.rose}` : `1.5px solid ${theme.line}`,
                background: input === name ? `${theme.rose}1a` : theme.bgCard,
                color: input === name ? theme.rose : theme.fade,
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <PrimaryButton tone="rose" onTap={confirm}>
          {input.trim() ? "Continue" : "Skip"}
        </PrimaryButton>
      </div>
    </Screen>
  );
}
