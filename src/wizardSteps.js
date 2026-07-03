export const PRE_STEPS = [
  {
    key: "format",
    q: "What's the format?",
    icon: "◇",
    options: ["Rolled", "Packed", "Vapor", "Baked", "Pressed", "Brewed"],
  },
  {
    key: "setting",
    q: "Where are you?",
    icon: "◎",
    options: ["Solo, indoors", "Solo, outdoors", "With friends", "Public space", "Somewhere new"],
  },
  {
    key: "toleranceContext",
    q: "Where are you at with use?",
    icon: "↻",
    options: ["First time today", "Redosing", "Recent tolerance break", "Regular use"],
  },
  {
    key: "physicalBaseline",
    q: "Quick body check — any of these true?",
    icon: "♡",
    multi: true,
    options: ["Eaten", "Hydrated", "Slept okay", "Running on empty"],
  },
  {
    key: "moodsPre",
    q: "How do you feel right now?",
    icon: "☼",
    multi: true,
    options: ["Calm", "Stressed", "Tired", "Excited", "Neutral", "Anxious", "Happy", "Wired"],
  },
  {
    key: "plansAfter",
    q: "Anything after this?",
    icon: "→",
    options: ["Nothing planned", "Driving later", "Social plans", "Work/responsibilities"],
  },
  {
    key: "safetyCheck",
    q: "Quick safety check — you good?",
    icon: "✓",
    options: ["All good", "A little cautious"],
  },
  {
    key: "returnTime",
    q: "When do you want to be back to baseline?",
    icon: "↺",
    options: ["30 min", "1 hour", "2 hours", "No rush"],
  },
];

export const POST_STEPS = [
  {
    key: "moodsPost",
    q: "Where's your head at?",
    icon: "☼",
    multi: true,
    options: ["Floaty", "Giggly", "Zen", "Introspective", "Overwhelmed", "Vibing", "Sleepy", "Energized", "Connected"],
  },
  {
    key: "intensity",
    q: "How high — honestly?",
    icon: "▲",
    options: ["Barely there", "Light", "Moderate", "Strong", "Very strong"],
  },
  {
    key: "appetite",
    q: "Appetite?",
    icon: "◯",
    options: ["Increased", "Decreased", "No change"],
  },
  {
    key: "paranoia",
    q: "Any anxiety or paranoia?",
    icon: "◐",
    options: ["None", "Mild", "Noticeable", "Strong"],
  },
  {
    key: "timeDistortion",
    q: "How's time feeling?",
    icon: "∞",
    options: ["Normal", "Slower than usual", "Faster than usual", "Hard to tell"],
  },
  {
    key: "physicalComfort",
    q: "Physically, how do you feel?",
    icon: "♡",
    options: ["Comfortable", "Slightly off", "Uncomfortable"],
  },
];

export const QUALITY_OPTIONS = ["Felt good", "Neutral", "Felt off"];
