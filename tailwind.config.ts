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
        // Updated to match Ambedkar Memorial style: Playfair Display for headings, Lato for body
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
          cream: "#FFFFFF",
          saffron: "#1D4ED8", // Royal Blue
          orange: "#1D4ED8", // Royal Blue
          gold: "#3B82F6", // Light Blue
          brown: "#0F172A", // Dark Navy
        },
        primary: {
          DEFAULT: "#1D4ED8", // Royal Blue
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#3B82F6", // Light Blue
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#1D4ED8",
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
