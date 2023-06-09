/** @type {import('tailwindcss').Config} */
const { toRadixVar, toRadixVars } = require("windy-radix-palette/vars");

module.exports = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "milkdown/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        xl: "1280px",
        "2xl": "1000px",
      },
    },
    extend: {
      colors: {
        border: toRadixVar("gray", 5),
        input: toRadixVar("gray", 6),
        ring: toRadixVar("gray", 7),
        background: toRadixVar("gray", 1),
        foreground: toRadixVar("gray", 12),
        primary: {
          DEFAULT: toRadixVar("gray", 12),
          foreground: toRadixVar("gray", 1),
        },
        secondary: {
          DEFAULT: toRadixVar("gray", 4),
          foreground: toRadixVar("gray", 12),
        },
        destructive: {
          DEFAULT: toRadixVar("red", 6),
          foreground: toRadixVar("red", 11),
        },
        muted: {
          DEFAULT: toRadixVar("gray", 3),
          foreground: toRadixVar("gray", 11),
        },
        accent: {
          DEFAULT: toRadixVar("gray", 3),
          foreground: toRadixVar("gray", 12),
        },
        popover: {
          DEFAULT: toRadixVar("gray", 1),
          foreground: toRadixVar("gray", 12),
        },
        card: {
          DEFAULT: toRadixVar("gray", 1),
          foreground: toRadixVar("gray", 12),
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("windy-radix-palette"),
    require("@tailwindcss/typography"),
    require("windy-radix-typography"),
  ],
};
