import { useState } from "react";
import { theme, fontDisplay, fontSans } from "../theme.js";
import { getLockState, setLockState } from "../storage.js";
import { hashPin } from "../pin.js";
import { Screen, Slab, SlabHead, Body, SectionRule, Card, Cta } from "../components/primitives.jsx";
import { PinDots, PinPad } from "../components/PinPad.jsx";

const STEP_TITLE = {
  verifyOld: "Enter current PIN",
  enterNew: "Choose a new PIN",
  confirmNew: "Confirm PIN",
};

export function LockSettingsScreen({ onBack }) {
  const [lockState, setLockStateLocal] = useState(getLockState());
  const [step, setStep] = useState("view");
  const [intent, setIntent] = useState(null);
  const [entered, setEntered] = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [error, setError] = useState(false);
  const [notice, setNotice] = useState("");

  const reset = () => {
    setStep("view");
    setEntered("");
    setFirstPin("");
    setError(false);
  };

  const startSet = () => {
    setIntent("set");
    setNotice("");
    setEntered("");
    setStep("enterNew");
  };
  const startChange = () => {
    setIntent("change");
    setNotice("");
    setEntered("");
    setStep("verifyOld");
  };
  const startOff = () => {
    setIntent("off");
    setNotice("");
    setEntered("");
    setStep("verifyOld");
  };

  const fail = (after) => {
    setError(true);
    setTimeout(() => {
      setError(false);
      setEntered("");
      after?.();
    }, 400);
  };

  const onDigit = async (d) => {
    if (entered.length >= 4 || error) return;
    const next = entered + d;
    setEntered(next);
    if (next.length !== 4) return;

    if (step === "verifyOld") {
      const hash = await hashPin(next);
      if (hash !== lockState?.pinHash) return fail();
      setEntered("");
      if (intent === "off") {
        setLockState(null);
        setLockStateLocal(null);
        setNotice("App Lock turned off.");
        reset();
      } else {
        setStep("enterNew");
      }
    } else if (step === "enterNew") {
      setFirstPin(next);
      setEntered("");
      setStep("confirmNew");
    } else if (step === "confirmNew") {
      if (next !== firstPin) return fail(() => setStep("enterNew"));
      const pinHash = await hashPin(next);
      const value = { enabled: true, pinHash };
      setLockState(value);
      setLockStateLocal(value);
      setNotice(intent === "change" ? "PIN changed." : "App Lock is on.");
      reset();
    }
  };
  const onBackspace = () => !error && setEntered((e) => e.slice(0, -1));

  if (step !== "view") {
    return (
      <Screen noBottomPad>
        <Slab>
          <SlabHead kicker="App Lock" onBack={reset} />
        </Slab>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 32px", gap: 32 }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 700, textTransform: "uppercase", color: theme.ink, margin: 0 }}>
              {STEP_TITLE[step]}
            </h1>
            {error && <p style={{ fontFamily: fontSans, fontSize: 12.5, color: theme.accent700, marginTop: 8 }}>PINs didn't match — try again</p>}
          </div>
          <PinDots length={4} filled={entered.length} error={error} />
          <PinPad onDigit={onDigit} onBackspace={onBackspace} />
        </div>
      </Screen>
    );
  }

  return (
    <Screen noBottomPad>
      <Slab>
        <SlabHead kicker="Settings" onBack={onBack} />
        <h2 style={{ fontFamily: fontDisplay, fontSize: 30, fontWeight: 700, textTransform: "uppercase", marginTop: 16, position: "relative" }}>
          App Lock
        </h2>
      </Slab>
      <Body>
        <Card>
          <SectionRule ink>Status</SectionRule>
          <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 13.5, marginTop: 8, lineHeight: 1.6 }}>
            {lockState?.enabled
              ? "App Lock is on. A PIN is required each time you return to the app."
              : "App Lock is off. Set a PIN to require it each time you return to the app."}
          </p>
          {notice && <p style={{ fontFamily: fontSans, color: theme.accent700, fontSize: 12.5, fontWeight: 600, marginTop: 10 }}>{notice}</p>}
        </Card>
        {lockState?.enabled ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Cta tone="ghost" onTap={startChange}>
              <span>Change PIN</span>
            </Cta>
            <Cta tone="danger" onTap={startOff}>
              <span>Turn Off Lock</span>
            </Cta>
          </div>
        ) : (
          <Cta onTap={startSet}>
            <span>Set a PIN</span>
          </Cta>
        )}
      </Body>
    </Screen>
  );
}
