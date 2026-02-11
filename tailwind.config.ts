import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        // Updated to match Shivsrushti style: Playfair Display for headings, Lato for body
        sans: ["Lato", "sans-serif"],
        display: ["Playfair Display", "serif"],
        marathi: ["Poppins", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))", // Linked to index.css
        foreground: "hsl(var(--foreground))", // Linked to index.css
        shiv: {
          cream: "#FFFBF2",
          saffron: "#D95D1E", // Terra Cotta Orange (Shivsrushti Match)
          orange: "#D95D1E", // Terra Cotta Orange
          gold: "#D4AF37", // Metallic Gold
          brown: "#3E2723", // Deep Brown
        },
        primary: {
          DEFAULT: "#D95D1E", // Terra Cotta Orange
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#8B0000", // Maroon
          foreground: "#FFFBF2",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#D95D1E",
          foreground: "#FFFFFF",
        }
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.8s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
