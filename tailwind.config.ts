import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", lg: "2rem" },
      screens: { "2xl": "1320px" }
    },
    extend: {
      colors: {
        ink: {
          950: "#000000",
          900: "#070707",
          800: "#0F0F0F",
          700: "#1A1A1A",
          600: "#212121",
          500: "#2A2A2A"
        },
        bone: {
          50: "#FFFFFF",
          100: "#EDEDED",
          200: "#D6D6D6",
          300: "#A8A8A8",
          400: "#6F6F6F"
        },
        accent: {
          glow: "#E6F0FF",
          electric: "#5FA8FF"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      letterSpacing: {
        tightest: "-0.04em"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px -20px rgba(0,0,0,0.6)",
        ring: "0 0 0 1px rgba(255,255,255,0.08)"
      },
      backgroundImage: {
        grid:
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        radial:
          "radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,0.08), transparent 60%)",
        noise:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"
      },
      animation: {
        "fade-up": "fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both",
        shimmer: "shimmer 2.4s linear infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        marquee: "marquee 40s linear infinite"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        pulseSoft: {
          "0%,100%": { opacity: "0.4" },
          "50%": { opacity: "1" }
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
