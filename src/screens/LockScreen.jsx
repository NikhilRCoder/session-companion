import { useState } from "react";
import { theme, fontDisplay, fontSans } from "../theme.js";
import { getLockState, setLockState } from "../storage.js";
import { hashPin } from "../pin.js";
import { Screen, Cta } from "../components/primitives.jsx";
import { PinDots, PinPad } from "../components/PinPad.jsx";

export function LockScreen({ onUnlock }) {
  const [entered, setEntered] = useState("");
  const [error, setError] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const verify = async (pin) => {
    const lockState = getLockState();
    const hash = await hashPin(pin);
    if (hash === lockState?.pinHash) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
        setEntered("");
      }, 400);
    }
  };

  const onDigit = (d) => {
    if (entered.length >= 4 || error) return;
    const next = entered + d;
    setEntered(next);
    if (next.length === 4) verify(next);
  };
  const onBackspace = () => !error && setEntered((e) => e.slice(0, -1));

  const resetLock = () => {
    setLockState(null);
    onUnlock();
  };

  return (
    <Screen>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 32px", gap: 32 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: fontDisplay, fontSize: 26, fontWeight: 700, textTransform: "uppercase", color: theme.ink, margin: 0 }}>
            Enter PIN
          </h1>
          <p style={{ fontFamily: fontSans, fontSize: 12.5, color: error ? theme.accent700 : theme.n600, marginTop: 8, minHeight: 16 }}>
            {error ? "Incorrect PIN" : "Session Companion is locked"}
          </p>
        </div>
        <PinDots length={4} filled={entered.length} error={error} />
        <PinPad onDigit={onDigit} onBackspace={onBackspace} />
        <div style={{ textAlign: "center" }}>
          {confirmingReset ? (
            <div>
              <p style={{ fontFamily: fontSans, fontSize: 12.5, color: theme.n600, marginBottom: 10, lineHeight: 1.6 }}>
                This removes your PIN lock. Your session data is not affected.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <Cta tone="ghost" onTap={() => setConfirmingReset(false)} style={{ flex: 1, justifyContent: "center", fontSize: 13, padding: "12px 0" }}>
                  <span>Cancel</span>
                </Cta>
                <Cta tone="danger" onTap={resetLock} style={{ flex: 1, justifyContent: "center", fontSize: 13, padding: "12px 0" }}>
                  <span>Reset Lock</span>
                </Cta>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmingReset(true)}
              style={{ background: "none", border: "none", color: theme.n600, fontFamily: fontSans, fontSize: 12.5, cursor: "pointer" }}
            >
              Forgot PIN?
            </button>
          )}
        </div>
      </div>
    </Screen>
  );
}
