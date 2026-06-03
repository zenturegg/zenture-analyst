import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        zntBlue: "#0057FF",
        zntDark: "#05070D",
        zntCard: "#0B0F1A",
      },
    },
  },
  plugins: [],
};
export default config;
