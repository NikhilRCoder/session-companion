import { useState, useEffect, useRef } from "react";
import { theme, fontDisplay, fontSans, fontMono } from "../theme.js";
import { getPeople, vibrate } from "../storage.js";
import { formatDuration, formatTime } from "../format.js";
import { totalDistance, formatDistance } from "../geo.js";
import { SYMPTOMS, REMINDER_MIN } from "../wizardSteps.js";
import { Screen, Slab, Ring, Body, Foot, SectionRule, Wrap, Chip, TextArea, Cta, Card } from "../components/primitives.jsx";
import { PlusIcon } from "../components/icons.jsx";

const PULSE_BARS = 30;
const MIN_PER_BAR = 3;

function clock(seconds) {
  return String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0");
}

export function ActiveSessionScreen({ live, onFinishSession, onEndDirect, onUpdateNotes, onLogCheckin }) {
  const [now, setNow] = useState(Date.now());
  const [panelOpen, setPanelOpen] = useState(false);
  const [draft, setDraft] = useState({ intensity: 5, symptoms: [], note: "" });
  const [cueAt, setCueAt] = useState(null);
  const [confirmingBail, setConfirmingBail] = useState(false);
  const startedAtRef = useRef(new Date(live.startTime).getTime());

  useEffect(() => {
    const id = setInterval(() => {
      const nowMs = Date.now();
      setNow(nowMs);
      const mins = Math.floor((nowMs - startedAtRef.current) / 60000);
      const due = Math.floor(mins / REMINDER_MIN) * REMINDER_MIN;
      if (mins > 0 && due > 0) setCueAt((prev) => (prev !== due ? due : prev));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const elapsedSeconds = Math.max(0, Math.floor((now - startedAtRef.current) / 1000));
  const filled = Math.min(PULSE_BARS, Math.ceil((elapsedSeconds + 1) / (MIN_PER_BAR * 60)));
  const people = getPeople();
  const peopleNames = (live.peopleIds || []).map((id) => people.find((p) => p.id === id)?.name).filter(Boolean);

  const openPanel = () => {
    setDraft({ intensity: 5, symptoms: [], note: "" });
    setCueAt(null);
    setPanelOpen(true);
  };
  const closePanel = () => {
    setPanelOpen(false);
    setCueAt(null);
  };
  const logCheckin = () => {
    onLogCheckin({ time: clock(elapsedSeconds), intensity: draft.intensity, symptoms: draft.symptoms, note: draft.note });
    setPanelOpen(false);
    setCueAt(null);
  };
  const toggleSymptom = (s) =>
    setDraft((d) => ({ ...d, symptoms: d.symptoms.includes(s) ? d.symptoms.filter((x) => x !== s) : [...d.symptoms, s] }));

  return (
    <Screen noBottomPad>
      <Slab style={{ padding: "20px 20px 22px" }}>
        <Ring style={{ top: -40, right: -30, width: 170, height: 170, color: theme.accent, opacity: 0.45 }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 9, height: 9, background: theme.accent, display: "inline-block", animation: "sc-blink 2s ease-in-out infinite" }} />
          <span style={{ fontFamily: fontDisplay, fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: theme.n400 }}>
            Session live
          </span>
        </div>
        <div style={{ position: "relative", fontFamily: fontDisplay, fontSize: 68, fontWeight: 700, lineHeight: 0.9, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", marginTop: 8 }}>
          {formatDuration(elapsedSeconds * 1000)}
        </div>
        <div style={{ position: "relative", display: "flex", gap: 3, marginTop: 14, height: 22, alignItems: "flex-end" }}>
          {Array.from({ length: PULSE_BARS }, (_, i) => (
            <i
              key={i}
              style={{
                flex: 1,
                height: i < filled ? "100%" : "38%",
                background: i < filled ? theme.accent : theme.n700,
                transform: "skewX(-14deg)",
                display: "block",
              }}
            />
          ))}
        </div>
        <div style={{ position: "relative", marginTop: 14, fontFamily: fontDisplay, fontSize: 14, fontWeight: 600, textTransform: "uppercase" }}>
          {live.intention || "—"} <span style={{ color: theme.accent }}>/</span> {live.method || "—"}{" "}
          <span style={{ color: theme.accent }}>/</span> {live.dose ? `${live.dose} ${live.doseUnit || "mg"}` : "no dose"}
        </div>
        {peopleNames.length > 0 && (
          <div style={{ position: "relative", marginTop: 6, fontFamily: fontSans, fontSize: 12, color: theme.n400 }}>
            With {peopleNames.join(", ")}
          </div>
        )}
        {live.track?.length > 0 && (
          <div style={{ position: "relative", marginTop: 6, fontFamily: fontSans, fontSize: 11, color: theme.n500 }}>
            ◉ tracking · {live.track.length} point{live.track.length === 1 ? "" : "s"} · {formatDistance(totalDistance(live.track))}
          </div>
        )}
      </Slab>
      <Body style={{ gap: 20, paddingTop: 22 }}>
        {cueAt && !panelOpen && (
          <div style={{ background: theme.accent, color: theme.surface, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" }}>
            <span style={{ width: 8, height: 8, background: theme.surface, transform: "rotate(45deg)", flex: "none" }} />
            <span style={{ fontFamily: fontDisplay, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Check-in due
            </span>
          </div>
        )}
        {panelOpen ? (
          <div style={{ border: `2px solid ${theme.ink}`, background: theme.surface, padding: "18px 16px", display: "flex", flexDirection: "column", gap: 18, clipPath: "polygon(0 0,100% 0,100% calc(100% - 20px),calc(100% - 20px) 100%,0 100%)" }}>
            <div style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 700, lineHeight: 0.95, textTransform: "uppercase", color: theme.ink }}>
              How are you
              <br />
              feeling now?
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 9 }}>
                <span style={{ fontFamily: fontDisplay, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: theme.ink }}>
                  Intensity
                </span>
                <span style={{ fontFamily: fontMono, fontSize: 24, fontWeight: 700, lineHeight: 1, color: theme.accent, fontVariantNumeric: "tabular-nums" }}>
                  {draft.intensity}/10
                </span>
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      vibrate();
                      setDraft((d) => ({ ...d, intensity: i }));
                    }}
                    aria-label={`Intensity ${i}`}
                    style={{
                      flex: 1,
                      height: 38,
                      padding: 0,
                      cursor: "pointer",
                      border: `2px solid ${theme.ink}`,
                      background: i <= draft.intensity ? theme.accent : "transparent",
                      transform: "skewX(-12deg)",
                    }}
                  />
                ))}
              </div>
            </div>
            <div>
              <SectionRule ink>Symptoms</SectionRule>
              <Wrap>
                {SYMPTOMS.map((s) => (
                  <Chip key={s} label={s} size="sm" selected={draft.symptoms.includes(s)} onTap={() => toggleSymptom(s)} />
                ))}
              </Wrap>
            </div>
            <div>
              <SectionRule ink>Note</SectionRule>
              <TextArea rows={2} placeholder="Anything to remember…" value={draft.note} onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Cta tone="ghost" onTap={closePanel} style={{ flex: "none", width: "auto", fontSize: 14, padding: "14px 18px" }}>
                <span>Cancel</span>
              </Cta>
              <Cta onTap={logCheckin} style={{ flex: 1, fontSize: 14, padding: "14px 18px", justifyContent: "center" }}>
                <span>Log it</span>
              </Cta>
            </div>
          </div>
        ) : (
          <Cta tone="ghost" onTap={openPanel}>
            <span>Check in now</span>
            <PlusIcon />
          </Cta>
        )}
        {live.checkins?.length > 0 && (
          <div>
            <SectionRule ink>Log</SectionRule>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {live.checkins.map((c, i) => (
                <div key={i} style={{ borderLeft: `6px solid ${theme.accent}`, background: theme.surface, padding: "10px 13px", display: "flex", gap: 12, alignItems: "baseline" }}>
                  <span style={{ fontFamily: fontDisplay, fontSize: 15, fontWeight: 700, fontVariantNumeric: "tabular-nums", flex: "none" }}>{c.time}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontFamily: fontSans, fontSize: 13 }}>
                      {c.symptoms.length ? c.symptoms.join(", ") : "No symptoms noted"}
                    </span>
                    <span style={{ display: "block", fontFamily: fontSans, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: theme.n600, marginTop: 2 }}>
                      Intensity {c.intensity}/10
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <SectionRule ink>Notes</SectionRule>
          <TextArea rows={3} placeholder="Free-text notes for the whole session…" value={live.notes || ""} onChange={(e) => onUpdateNotes(e.target.value)} />
        </div>
      </Body>
      <Foot>
        <Cta tone="ink" onTap={onFinishSession}>
          <span>End session</span>
          <span style={{ width: 14, height: 14, background: theme.accent, display: "inline-block" }} />
        </Cta>
        {confirmingBail ? (
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button onClick={() => setConfirmingBail(false)} style={{ flex: 1, background: "none", border: `2px solid ${theme.ink}`, padding: "10px 0", fontFamily: fontSans, fontSize: 12.5, color: theme.n600, cursor: "pointer" }}>
              Cancel
            </button>
            <button onClick={onEndDirect} style={{ flex: 1, background: "none", border: `2px solid ${theme.accent700}`, padding: "10px 0", fontFamily: fontSans, fontSize: 12.5, color: theme.accent700, cursor: "pointer" }}>
              Confirm — skip debrief
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingBail(true)}
            style={{ display: "block", margin: "10px auto 0", background: "none", border: "none", color: theme.n600, fontFamily: fontSans, fontSize: 12, cursor: "pointer" }}
          >
            End without debrief
          </button>
        )}
      </Foot>
    </Screen>
  );
}
