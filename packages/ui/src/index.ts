export const markerPresets = [
  {
    key: "strong-recommend",
    emoji: "❤️",
    label: "강력 추천",
    colorName: "heart-red",
    colorHex: "#e23b3b",
  },
  {
    key: "good",
    emoji: "🧡",
    label: "좋음",
    colorName: "heart-orange",
    colorHex: "#f07a2b",
  },
  {
    key: "okay",
    emoji: "💛",
    label: "괜찮음",
    colorName: "heart-yellow",
    colorHex: "#e4b72e",
  },
  {
    key: "memory",
    emoji: "💚",
    label: "추억",
    colorName: "heart-green",
    colorHex: "#2f9f64",
  },
  {
    key: "reconsider",
    emoji: "💙",
    label: "다시 검토",
    colorName: "heart-blue",
    colorHex: "#3b82d6",
  },
  {
    key: "special-day",
    emoji: "💜",
    label: "특별한 날",
    colorName: "heart-purple",
    colorHex: "#8b5fc7",
  },
  {
    key: "low-revisit",
    emoji: "🖤",
    label: "재방문 낮음",
    colorName: "heart-black",
    colorHex: "#242424",
  },
] as const;

export const designTokens = {
  color: {
    background: "#f7f8f3",
    surface: "#ffffff",
    surfaceRaised: "#f0f4ec",
    text: "#17211b",
    muted: "#647067",
    border: "#dfe7dc",
    brand: "#277548",
    brandStrong: "#1f5f3a",
  },
  radius: {
    control: "8px",
    panel: "8px",
    round: "999px",
  },
  shadow: {
    panel: "0 18px 50px rgba(23, 33, 27, 0.14)",
    marker: "0 10px 24px rgba(23, 33, 27, 0.18)",
  },
} as const;

export type MarkerPreset = (typeof markerPresets)[number];
