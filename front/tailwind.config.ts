const colors = require("tailwindcss/colors")
const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom dark theme colors
        "dark-background": "#1A1A2E", // A deep, soft dark blue/purple
        "dark-foreground": "#E0E0E0", // Light grey for text
        "dark-card": "#2C2C4A", // Slightly lighter than background for cards
        "dark-border": "#4A4A6A", // Border color
        "dark-input": "#3A3A5A", // Input background
        "dark-primary": "#BB86FC", // Vibrant purple for primary actions
        "dark-primary-foreground": "#FFFFFF", // White text on primary
        "dark-secondary": "#03DAC6", // Teal for secondary actions
        "dark-secondary-foreground": "#000000", // Black text on secondary
        "dark-muted": "#8888AA", // Muted text
        "dark-muted-foreground": "#AAAAAA", // Muted foreground text
        "dark-accent": "#4A4A6A", // Accent background
        "dark-accent-foreground": "#E0E0E0", // Accent foreground text
        "dark-destructive": "#CF6679", // Red for destructive actions
        "dark-destructive-foreground": "#FFFFFF", // White text on destructive

        // Section specific backgrounds (slightly different shades of the dark theme)
        "dark-movie-bg": "#221E33", // Darker blue-purple for movies
        "dark-book-bg": "#2E1A2E", // Darker purple-red for books
        "dark-series-bg": "#1A2E2E", // Darker teal-blue for series

        // Existing specific colors (adjusting to dark theme if needed)
        "movie-red": "#FF6B6B",
        "book-green": "#6BFF6B",
        "series-blue": "#6B6BFF",
        "list-purple": "#BB86FC", // Using dark-primary
        "feed-orange": "#FFB36B",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
