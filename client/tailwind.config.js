/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
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
        blue: {
          300: "#7AB5FF",
          400: "#4A9CFF",
          500: "#0078FF",
          600: "#0062D6",
          700: "#0052B3",
          800: "#003D85",
          900: "#002A5C",
        },
        green: {
          300: "#7AFFB5",
          400: "#4AFF8A",
          500: "#00FF62",
          600: "#00D651",
          700: "#00B344",
          800: "#008533",
          900: "#005C24",
        },
        orange: {
          300: "#FFBE7A",
          400: "#FFA64A",
          500: "#FF8A00",
          600: "#D67300",
          700: "#B35F00",
          800: "#854700",
          900: "#5C3100",
        },
        red: {
          300: "#FF7A7A",
          400: "#FF4A4A",
          500: "#FF0000",
          600: "#D60000",
          700: "#B30000",
          800: "#850000",
          900: "#5C0000",
        },
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
  plugins: [],
};
