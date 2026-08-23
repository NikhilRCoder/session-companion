import { useState, useEffect } from "react";
import { googleFontsUrl, theme } from "./theme.js";
import { getLiveSession, setLiveSession as persistLiveSession, getSessions, saveSessions, getFields, makeId } from "./storage.js";
import { captureLocation, toPoint, distanceMeters } from "./geo.js";
import { splitCustomAnswers } from "./customFields.js";
import { BottomNav } from "./components/BottomNav.jsx";
import { PreStep1 } from "./screens/PreStep1.jsx";
import { PreStep2 } from "./screens/PreStep2.jsx";
import { PostStep1 } from "./screens/PostStep1.jsx";
import { PostStep2 } from "./screens/PostStep2.jsx";
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

const PRE_KEYS = ["intention", "method", "strain", "dose", "doseUnit", "tolerance", "baselineMood", "environment", "physical"];
const POST_KEYS = ["rating", "effects", "metIntention", "sideEffects", "comedownNotes", "repeat"];

const HIDDEN_NAV_SCREENS = ["pre1", "peoplePick", "pre2", "active", "post1", "post2", "interactionQuality", "place", "reflection", "summary", "settings"];

export default function App() {
  const resumedLive = getLiveSession();
  const [tab, setTab] = useState("home");
  const [screen, setScreen] = useState(resumedLive ? resumedLive.screen : "home");
  const [preAnswers, setPreAnswers] = useState(resumedLive?.preAnswers || {});
  const [peopleIds, setPeopleIds] = useState(resumedLive?.peopleIds || []);
  const [liveSession, setLiveSessionState] = useState(resumedLive?.live || null);
  const [postAnswers, setPostAnswers] = useState({});
  const [quality, setQuality] = useState({});
  const [place, setPlace] = useState("");
  const [cost, setCost] = useState(undefined);
  const [reflection, setReflection] = useState("");
  const [finalSeconds, setFinalSeconds] = useState(0);
  const [completedSession, setCompletedSession] = useState(null);

  useEffect(() => {
    const wizardInProgress = ["pre1", "peoplePick", "pre2"].includes(screen);
    persistLiveSession(
      wizardInProgress
        ? { screen, preAnswers, peopleIds, live: null }
        : screen === "active" && liveSession
        ? { screen, live: liveSession, preAnswers: {}, peopleIds: [] }
        : null
    );
  }, [screen, preAnswers, peopleIds, liveSession]);

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
    setPeopleIds([]);
    setScreen("pre1");
  };

  const beginSession = () => {
    const { rest, custom } = splitCustomAnswers(preAnswers, PRE_KEYS, getFields());
    const live = {
      ...rest,
      peopleIds,
      notes: "",
      checkins: [],
      ...(Object.keys(custom).length ? { custom } : {}),
      startTime: new Date().toISOString(),
    };
    setLiveSessionState(live);
    setScreen("active");
    captureLocation().then((location) => {
      if (!location) return;
      setLiveSessionState((prev) =>
        prev && prev.startTime === live.startTime
          ? { ...prev, location, track: prev.track?.length ? prev.track : [{ ...location, t: Date.now() }] }
          : prev
      );
    });
  };

  const updateLiveNotes = (notes) => setLiveSessionState((prev) => ({ ...prev, notes }));
  const logCheckin = (entry) => setLiveSessionState((prev) => ({ ...prev, checkins: [...(prev.checkins || []), entry] }));

  const startDebrief = () => {
    setFinalSeconds(liveSession ? Math.max(0, Math.floor((Date.now() - new Date(liveSession.startTime).getTime()) / 1000)) : 0);
    setPostAnswers({});
    setQuality({});
    setPlace("");
    setCost(undefined);
    setReflection("");
    setScreen("post1");
  };

  const finishSession = (extra) => {
    const { rest, custom: postCustom } = splitCustomAnswers(postAnswers, POST_KEYS, getFields());
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
  const hasPeople = (liveSession?.peopleIds || []).length > 0;

  let body;
  if (screen === "pre1") {
    body = <PreStep1 answers={preAnswers} setAnswers={setPreAnswers} onBack={() => setScreen("home")} onNext={() => setScreen("peoplePick")} />;
  } else if (screen === "peoplePick") {
    body = <PeoplePickerStep peopleIds={peopleIds} setPeopleIds={setPeopleIds} onBack={() => setScreen("pre1")} onNext={() => setScreen("pre2")} />;
  } else if (screen === "pre2") {
    body = <PreStep2 answers={preAnswers} setAnswers={setPreAnswers} onBack={() => setScreen("peoplePick")} onNext={beginSession} />;
  } else if (screen === "active" && liveSession) {
    body = (
      <ActiveSessionScreen live={liveSession} onFinishSession={startDebrief} onEndDirect={endDirect} onUpdateNotes={updateLiveNotes} onLogCheckin={logCheckin} />
    );
  } else if (screen === "post1") {
    body = <PostStep1 answers={postAnswers} setAnswers={setPostAnswers} finalSeconds={finalSeconds} onBack={() => setScreen("active")} onNext={() => setScreen("post2")} />;
  } else if (screen === "post2") {
    body = (
      <PostStep2
        answers={postAnswers}
        setAnswers={setPostAnswers}
        onBack={() => setScreen("post1")}
        onNext={() => setScreen(hasPeople ? "interactionQuality" : "place")}
      />
    );
  } else if (screen === "interactionQuality") {
    body = (
      <InteractionQualityStep
        peopleIds={liveSession?.peopleIds || []}
        quality={quality}
        setQuality={setQuality}
        onBack={() => setScreen("post2")}
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
        sessionLocation={liveSession?.track?.length ? liveSession.track[liveSession.track.length - 1] : liveSession?.location}
        onBack={() => setScreen(hasPeople ? "interactionQuality" : "post2")}
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
        kicker="Debrief"
        title="Anything coming up?"
        placeholder="Thoughts, feelings, anything worth remembering..."
        buttonLabel="Close session"
      />
    );
  } else if (screen === "summary" && completedSession) {
    body = <SessionSummary session={completedSession} justFinished onDone={doneSummary} />;
  } else if (screen === "settings") {
    body = <SettingsScreen onBack={() => setScreen("home")} />;
  } else if (tab === "home") {
    body = <HomeScreen onStart={startWizard} onHistory={() => setTab("history")} onSettings={() => setScreen("settings")} />;
  } else if (tab === "history") {
    body = <HistoryScreen onBack={() => setTab("home")} />;
  } else if (tab === "people") {
    body = <PeopleScreen />;
  } else if (tab === "insights") {
    body = <InsightsScreen />;
  }

  return (
    <div
      style={{
        position: "relative",
        background: theme.bg,
        color: theme.ink,
        maxWidth: 412,
        margin: "0 auto",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('${googleFontsUrl}');
        * { box-sizing: border-box; }
        body { margin: 0; }
        textarea, button, input { outline: none; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 0px; }
        @keyframes sc-blink { 0%, 100% { opacity: 1; } 50% { opacity: .25; } }
      `}</style>
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(to right, rgba(32,30,29,.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(32,30,29,.07) 1px, transparent 1px)`,
          backgroundSize: "34px 34px",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, flex: 1, overflowY: "auto" }}>{body}</div>
      {showBottomNav && (
        <div style={{ position: "relative", zIndex: 1 }}>
          <BottomNav
            active={tab}
            onChange={(newTab) => {
              setTab(newTab);
              setScreen(newTab === "home" ? "home" : screen);
            }}
          />
        </div>
      )}
    </div>
  );
}
