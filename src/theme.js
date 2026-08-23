export const theme = {
  bg: "#f3f2f2",
  surface: "#f8f4f4",
  ink: "#201e1d",
  accent: "#ec3013",
  accent100: "#fff2ef",
  accent600: "#dd2b0f",
  accent700: "#ae1800",
  n300: "#d7d3d3",
  n400: "#b6b2b2",
  n500: "#928e8e",
  n600: "#767272",
  n700: "#605d5d",
  n900: "#2d2b2b",
  danger: "#ae1800",
};

export const fontDisplay = "'Chakra Petch', system-ui, sans-serif";
export const fontSans = "'Space Grotesk', system-ui, sans-serif";
export const fontMono = fontDisplay;

export const googleFontsUrl =
  "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap";

// Bottom-right corner chamfer, matching the prototype's `.cut` utility.
export const chamfer = (px = 16) =>
  `polygon(0 0, 100% 0, 100% calc(100% - ${px}px), calc(100% - ${px}px) 100%, 0 100%)`;

// Top-left corner chamfer, for back/icon buttons.
export const chamferTL = (px = 12) => `polygon(${px}px 0, 100% 0, 100% 100%, 0 100%, 0 ${px}px)`;
