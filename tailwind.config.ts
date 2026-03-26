import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#00C9A7",
        secondary: "#7A8CA2",
        glass: "rgba(255,255,255,0.1)"
      },
      boxShadow: {
        soft: "0 10px 40px rgba(0,0,0,0.12)"
      }
    }
  },
  plugins: []
};

export default config;
