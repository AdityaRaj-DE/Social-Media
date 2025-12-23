import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        text: "var(--text)",
        muted: "var(--muted)",
        accent: {
          DEFAULT: "var(--accent)",
          400: "var(--accent-400)",
          600: "var(--accent-600)",
        },
      },
      boxShadow: {
        premium: "var(--shadow)",
      },
      borderColor: {
        glass: "var(--glass-border)",
      },
      borderRadius: {
        card: "1rem",
        pill: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
