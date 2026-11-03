import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "rgb(var(--ink-950) / <alpha-value>)", 900: "rgb(var(--ink-900) / <alpha-value>)", 800: "rgb(var(--ink-800) / <alpha-value>)", 700: "rgb(var(--ink-700) / <alpha-value>)" },
        lagoon: { 300: "rgb(var(--lagoon-300) / <alpha-value>)", 400: "rgb(var(--lagoon-400) / <alpha-value>)", 500: "rgb(var(--lagoon-500) / <alpha-value>)", 600: "rgb(var(--lagoon-600) / <alpha-value>)" },
        brass: { 200: "rgb(var(--brass-200) / <alpha-value>)", 300: "rgb(var(--brass-300) / <alpha-value>)", 400: "rgb(var(--brass-400) / <alpha-value>)", 500: "rgb(var(--brass-500) / <alpha-value>)", 600: "rgb(var(--brass-600) / <alpha-value>)" },
        porcelain: "rgb(var(--porcelain) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "var(--font-bn)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-bn)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "var(--font-bn)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-100%)" } },
      },
      animation: {
        marquee: "marquee 50s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
