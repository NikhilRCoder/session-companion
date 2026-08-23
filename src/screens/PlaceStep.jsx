import { useState } from "react";
import { theme, fontDisplay } from "../theme.js";
import { getPlaces, savePlaces, getSessions } from "../storage.js";
import { nearestKnownPlace } from "../geo.js";
import { Screen, Slab, SlabHead, Hatch, Body, Foot, SectionRule, Wrap, Chip, Input, Cta } from "../components/primitives.jsx";
import { Arrow } from "../components/icons.jsx";

export function PlaceStep({ place, setPlace, cost, setCost, sessionLocation, onBack, onNext }) {
  const [places, setPlaces] = useState(getPlaces());
  const [input, setInput] = useState(place || "");
  const [costInput, setCostInput] = useState(typeof cost === "number" ? String(cost) : "");
  const [suggestion] = useState(() => (sessionLocation ? nearestKnownPlace(getSessions(), sessionLocation) : null));

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
    <Screen noBottomPad>
      <Slab>
        <Hatch />
        <SlabHead kicker="Debrief" onBack={onBack} />
        <h2 style={{ fontFamily: fontDisplay, fontSize: 32, fontWeight: 700, textTransform: "uppercase", lineHeight: 1, marginTop: 18, position: "relative" }}>
          Where was this? <span style={{ color: theme.n400 }}>(optional)</span>
        </h2>
      </Slab>
      <Body>
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a place name..." />
        <Input
          value={costInput}
          onChange={(e) => setCostInput(e.target.value)}
          placeholder="Amount spent (optional)"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
        />
        {suggestion && !input && (
          <div>
            <SectionRule hint="Suggested">Near your usual spot</SectionRule>
            <Chip label={suggestion.place} size="sm" onTap={() => pickPlace(suggestion.place)} />
          </div>
        )}
        {places.length > 0 && (
          <div>
            <SectionRule>Saved places</SectionRule>
            <Wrap>
              {places.map((name) => (
                <Chip key={name} label={name} size="sm" selected={input === name} onTap={() => pickPlace(name)} />
              ))}
            </Wrap>
          </div>
        )}
      </Body>
      <Foot>
        <Cta onTap={confirm}>
          <span>{input.trim() ? "Continue" : "Skip"}</span>
          <Arrow />
        </Cta>
      </Foot>
    </Screen>
  );
}
