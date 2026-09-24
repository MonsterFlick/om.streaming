import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: "#08090c",
          surface: "#0e1017",
          card: "rgba(16, 18, 25, 0.75)",
          cardHover: "rgba(24, 27, 38, 0.85)",
          border: "rgba(255, 255, 255, 0.10)",
          borderFocus: "rgba(255, 255, 255, 0.25)",
          muted: "#636979",
          text: "#f4f5f8",
          subtext: "#9ba1b2",
          amber: "#f59e0b",
          coral: "#ff5252",
          cobalt: "#3b82f6",
          emerald: "#10b981",
          violet: "#8b5cf6",
        },
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      backdropBlur: {
        xs: "2px",
        luxe: "28px",
      },
      boxShadow: {
        luxe: "0 20px 48px -12px rgba(0, 0, 0, 0.65), 0 0 1px 1px rgba(255, 255, 255, 0.08) inset",
        glowAmber: "0 0 32px rgba(245, 158, 11, 0.25)",
        glowCobalt: "0 0 32px rgba(59, 130, 246, 0.25)",
        tactile: "0 4px 0 rgba(0,0,0,0.5), 0 8px 16px rgba(0,0,0,0.4)",
        tactileActive: "0 1px 0 rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.4)",
      },
      animation: {
        "float-mesh": "floatMesh 18s ease-in-out infinite alternate",
        "pulse-subtle": "pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "marquee": "marquee 25s linear infinite",
      },
      keyframes: {
        floatMesh: {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "100%": { transform: "scale(1.12) rotate(8deg)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
