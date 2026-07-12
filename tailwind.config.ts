import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: "#101225",
        "navy-soft": "#171B35",
        "navy-border": "#32395D",
        signal: "#D7A84A",
        "signal-dark": "#A96F1F",
        comet: "#5967D8",
        moon: "#EEF0FA",
        danger: "#D24B6A"
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"]
      },
      boxShadow: {
        signal: "0 16px 34px rgba(215, 168, 74, 0.22)"
      },
      keyframes: {
        idlePulse: {
          "0%, 100%": {
            boxShadow: "0 0 0 rgba(215, 168, 74, 0.1)"
          },
          "50%": {
            boxShadow: "0 0 28px rgba(215, 168, 74, 0.26)"
          }
        },
        shimmer: {
          "0%": {
            backgroundPosition: "-200% 0"
          },
          "100%": {
            backgroundPosition: "200% 0"
          }
        }
      },
      animation: {
        "idle-pulse": "idlePulse 2.2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
