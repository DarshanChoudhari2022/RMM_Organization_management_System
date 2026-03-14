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
        background: "hsl(var(--background))", 
        foreground: "hsl(var(--foreground))", 
        shiv: {
          cream: "#FDFBF7",
          saffron: "#D4AF37", // Premium Gold
          orange: "#D4AF37", // Premium Gold
          gold: "#D4AF37", // Premium Gold
          brown: "#0B192C", // Deep Royal Navy
        },
        primary: {
          DEFAULT: "#D4AF37", // Premium Gold
          foreground: "#0B192C", // Navy text on gold
        },
        secondary: {
          DEFAULT: "#0B192C", // Deep Royal Navy
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#D4AF37",
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
