import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [".src/app/**/*.{ts,tsx}", ".src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
