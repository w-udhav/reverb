import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/(pages)/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "SF Pro Text",
          "SF Pro Display",
          "-apple-system",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "Apple Color Emoji",
          "Segoe UI Emoji",
        ],
      },
      borderRadius: {
        ios: "1.5rem", // rounded-3xl baseline
      },
      boxShadow: {
        "ios-soft": "0 10px 25px -5px rgba(0,0,0,0.1)",
      },
      backgroundImage: {
        "gradient-happy": "var(--gradient-happy)",
        "gradient-calm": "var(--gradient-calm)",
        "gradient-love": "var(--gradient-love)",
        "gradient-sad": "var(--gradient-sad)",
        "gradient-angry": "var(--gradient-angry)",
        "gradient-nostalgic": "var(--gradient-nostalgic)",
      },
      colors: {
        emotion: {
          happy: {
            start: "rgb(var(--happy-start) / <alpha-value>)",
            end: "rgb(var(--happy-end) / <alpha-value>)",
          },
          calm: {
            start: "rgb(var(--calm-start) / <alpha-value>)",
            end: "rgb(var(--calm-end) / <alpha-value>)",
          },
          love: {
            start: "rgb(var(--love-start) / <alpha-value>)",
            end: "rgb(var(--love-end) / <alpha-value>)",
          },
          sad: {
            start: "rgb(var(--sad-start) / <alpha-value>)",
            end: "rgb(var(--sad-end) / <alpha-value>)",
          },
          angry: {
            start: "rgb(var(--angry-start) / <alpha-value>)",
            end: "rgb(var(--angry-end) / <alpha-value>)",
          },
          nostalgic: {
            start: "rgb(var(--nostalgic-start) / <alpha-value>)",
            end: "rgb(var(--nostalgic-end) / <alpha-value>)",
          },
        },
      },
    },
  },
  plugins: [
    function ({
      addComponents,
    }: {
      addComponents: (components: Record<string, any>) => void;
    }) {
      addComponents({
        ".ios-card": {
          borderRadius: "1.5rem",
          backgroundColor: "rgb(255 255 255 / 0.4)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
        },
        ".ios-pressable": {
          transition: "transform 120ms ease, opacity 120ms ease",
        },
        ".ios-pressable:active": {
          transform: "scale(0.98)",
        },
      });
    },
  ],
};

export default config;
