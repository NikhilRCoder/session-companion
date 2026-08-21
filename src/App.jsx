import { useState, useEffect } from "react";
import { googleFontsUrl, theme } from "./theme.js";
import { getLiveSession, setLiveSession as persistLiveSession, getSessions, saveSessions, getFields, makeId } from "./storage.js";
import { captureLocation, toPoint, distanceMeters } from "./geo.js";
import { PRE_STEPS, POST_STEPS } from "./wizardSteps.js";
import { customStepsFor, splitCustomAnswers } from "./customFields.js";
import { WizardStep } from "./components/WizardStep.jsx";
import { BottomNav } from "./components/BottomNav.jsx";
import { PeoplePickerStep } from "./screens/PeoplePickerStep.jsx";
import { TextPromptStep } from "./screens/TextPromptStep.jsx";
import { ActiveSessionScreen } from "./screens/ActiveSessionScreen.jsx";
import { InteractionQualityStep } from "./screens/InteractionQualityStep.jsx";
import { PlaceStep } from "./screens/PlaceStep.jsx";
import { SessionSummary } from "./screens/SessionSummary.jsx";
import { SettingsScreen } from "./screens/SettingsScreen.jsx";
import { HomeScreen } from "./screens/HomeScreen.jsx";
import { HistoryScreen } from "./screens/HistoryScreen.jsx";
import { PeopleScreen } from "./screens/PeopleScreen.jsx";
import { InsightsScreen } from "./screens/InsightsScreen.jsx";

const HIDDEN_NAV_SCREENS = [
  "pre",
  "peoplePick",
  "intention",
  "active",
  "post",
  "interactionQuality",
  "place",
  "reflection",
  "summary",
  "settings",
];

export default function App() {
  const resumedLive = getLiveSession();
  const [tab, setTab] = useState("home");
  const [screen, setScreen] = useState(resumedLive ? resumedLive.screen : "home");
  const [preAnswers, setPreAnswers] = useState(resumedLive?.preAnswers || {});
  const [preStep, setPreStep] = useState(resumedLive?.preStep || 0);
  const [peopleIds, setPeopleIds] = useState(resumedLive?.peopleIds || []);
  const [intention, setIntention] = useState(resumedLive?.intention || "");
  const [liveSession, setLiveSessionState] = useState(resumedLive?.live || null);
  const [postAnswers, setPostAnswers] = useState({});
  const [postStep, setPostStep] = useState(0);
  const [quality, setQuality] = useState({});
  const [place, setPlace] = useState("");
  const [cost, setCost] = useState(undefined);
  const [reflection, setReflection] = useState("");
  const [completedSession, setCompletedSession] = useState(null);

  useEffect(() => {
    const wizardInProgress = ["pre", "peoplePick", "intention"].includes(screen);
    persistLiveSession(
      wizardInProgress
        ? { screen, preAnswers, preStep, peopleIds, intention, live: null }
        : screen === "active" && liveSession
        ? { screen, live: liveSession, preAnswers: {}, preStep: 0, peopleIds: [], intention: "" }
        : null
    );
  }, [screen, preAnswers, preStep, peopleIds, intention, liveSession]);

  const hasLiveSession = liveSession !== null;
  useEffect(() => {
    if (!hasLiveSession || !navigator.geolocation) return;
    const appendPoint = (point) => {
      if (!point || point.accuracy > 100) return;
      setLiveSessionState((prev) => {
        if (!prev) return prev;
        const track = prev.track || [];
        if (track.length >= 500) return prev;
        const last = track[track.length - 1];
        if (last && distanceMeters(last, point) < 25) return prev;
        return { ...prev, track: [...track, point] };
      });
    };
    const watchId = navigator.geolocation.watchPosition(
      (pos) => appendPoint({ ...toPoint(pos), t: Date.now() }),
      (err) => {
        if (err.code === 1) navigator.geolocation.clearWatch(watchId);
      },
      { enableHighAccuracy: false, maximumAge: 15000 }
    );
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        captureLocation({ maximumAgeMs: 0 }).then((p) => p && appendPoint({ ...p, t: Date.now() }));
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      navigator.geolocation.clearWatch(watchId);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [hasLiveSession]);

  const startWizard = () => {
    setPreAnswers({});
    setPreStep(0);
    setPeopleIds([]);
    setIntention("");
    setScreen("pre");
  };

  const beginSession = () => {
    const { rest, custom } = splitCustomAnswers(preAnswers, PRE_STEPS, getFields());
    const live = {
      ...rest,
      peopleIds,
      intention,
      notes: "",
      ...(Object.keys(custom).length ? { custom } : {}),
      startTime: new Date().toISOString(),
    };
    setLiveSessionState(live);
    setScreen("active");
    captureLocation().then((location) => {
      if (!location) return;
      setLiveSessionState((prev) =>
        prev && prev.startTime === live.startTime
          ? {
              ...prev,
              location,
              track: prev.track?.length ? prev.track : [{ ...location, t: Date.now() }],
            }
          : prev
      );
    });
  };

  const updateLiveNotes = (notes) => setLiveSessionState((prev) => ({ ...prev, notes }));

  const startCheckIn = () => {
    setPostAnswers({});
    setPostStep(0);
    setQuality({});
    setPlace("");
    setCost(undefined);
    setReflection("");
    setScreen("post");
  };

  const finishSession = (extra) => {
    const { rest, custom: postCustom } = splitCustomAnswers(postAnswers, POST_STEPS, getFields());
    const mergedCustom = { ...(liveSession?.custom || {}), ...postCustom };
    const completed = {
      id: makeId(),
      ...liveSession,
      ...rest,
      ...extra,
      ...(Object.keys(mergedCustom).length ? { custom: mergedCustom } : {}),
      endTime: new Date().toISOString(),
    };
    saveSessions([completed, ...getSessions()]);
    setCompletedSession(completed);
    setLiveSessionState(null);
    setScreen("summary");
  };

  const endDirect = () => finishSession({});

  const doneSummary = () => {
    setCompletedSession(null);
    setScreen("home");
    setTab("home");
  };

  const showBottomNav = !HIDDEN_NAV_SCREENS.includes(screen);
  const preSteps = [...PRE_STEPS, ...customStepsFor("pre")];
  const postSteps = [...POST_STEPS, ...customStepsFor("post")];

  let body;
  if (screen === "pre") {
    body = (
      <WizardStep
        steps={preSteps}
        answers={preAnswers}
        setAnswers={setPreAnswers}
        stepIndex={Math.min(preStep, preSteps.length - 1)}
        setStepIndex={setPreStep}
        onFinish={() => setScreen("peoplePick")}
        onExitBack={() => setScreen("home")}
        finishLabel="Continue"
        eyebrow="Before You Begin"
      />
    );
  } else if (screen === "peoplePick") {
    body = (
      <PeoplePickerStep
        peopleIds={peopleIds}
        setPeopleIds={setPeopleIds}
        onBack={() => {
          setPreStep(preSteps.length - 1);
          setScreen("pre");
        }}
        onNext={() => setScreen("intention")}
      />
    );
  } else if (screen === "intention") {
    body = (
      <TextPromptStep
        value={intention}
        onChange={setIntention}
        onBack={() => setScreen("peoplePick")}
        onNext={beginSession}
        icon="✎"
        eyebrow="Last Thing"
        title="Set an intention"
        placeholder="Relax... create... connect... or leave it blank."
        buttonLabel="Begin Session"
        tone="gold"
      />
    );
  } else if (screen === "active" && liveSession) {
    body = (
      <ActiveSessionScreen
        live={liveSession}
        onCheckIn={startCheckIn}
        onEndDirect={endDirect}
        onUpdateNotes={updateLiveNotes}
      />
    );
  } else if (screen === "post") {
    body = (
      <WizardStep
        steps={postSteps}
        answers={postAnswers}
        setAnswers={setPostAnswers}
        stepIndex={Math.min(postStep, postSteps.length - 1)}
        setStepIndex={setPostStep}
        onFinish={() => setScreen((liveSession?.peopleIds || []).length > 0 ? "interactionQuality" : "place")}
        onExitBack={() => setScreen("active")}
        finishLabel="Continue"
        eyebrow="Checking In"
        tone="rose"
      />
    );
  } else if (screen === "interactionQuality") {
    body = (
      <InteractionQualityStep
        peopleIds={liveSession?.peopleIds || []}
        quality={quality}
        setQuality={setQuality}
        onBack={() => {
          setPostStep(postSteps.length - 1);
          setScreen("post");
        }}
        onNext={() => setScreen("place")}
      />
    );
  } else if (screen === "place") {
    body = (
      <PlaceStep
        place={place}
        setPlace={setPlace}
        cost={cost}
        setCost={setCost}
        sessionLocation={
          liveSession?.track?.length ? liveSession.track[liveSession.track.length - 1] : liveSession?.location
        }
        onBack={() => setScreen((liveSession?.peopleIds || []).length > 0 ? "interactionQuality" : "post")}
        onNext={() => setScreen("reflection")}
      />
    );
  } else if (screen === "reflection") {
    body = (
      <TextPromptStep
        value={reflection}
        onChange={setReflection}
        onBack={() => setScreen("place")}
        onNext={() => finishSession({ interactionQuality: quality, place, cost, reflection })}
        icon="◐"
        eyebrow="Last Thing"
        title="Anything coming up?"
        placeholder="Thoughts, feelings, anything worth remembering..."
        buttonLabel="Close Session"
        tone="rose"
      />
    );
  } else if (screen === "summary" && completedSession) {
    body = <SessionSummary session={completedSession} onDone={doneSummary} />;
  } else if (screen === "settings") {
    body = <SettingsScreen onBack={() => setScreen("home")} />;
  } else if (tab === "home") {
    body = <HomeScreen onStart={startWizard} onSettings={() => setScreen("settings")} />;
  } else if (tab === "history") {
    body = <HistoryScreen />;
  } else if (tab === "people") {
    body = <PeopleScreen />;
  } else if (tab === "insights") {
    body = <InsightsScreen />;
  }

  return (
    <div
      style={{
        background: theme.bg,
        color: theme.bone,
        maxWidth: 430,
        margin: "0 auto",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('${googleFontsUrl}');
        * { box-sizing: border-box; }
        body { margin: 0; }
        textarea, button, input { outline: none; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 0px; }
      `}</style>
      <div style={{ flex: 1, overflowY: "auto", paddingTop: "max(20px, env(safe-area-inset-top))" }}>{body}</div>
      {showBottomNav && (
        <BottomNav
          active={tab}
          onChange={(newTab) => {
            setTab(newTab);
            setScreen(newTab === "home" ? "home" : screen);
          }}
        />
      )}
    </div>
  );
}
