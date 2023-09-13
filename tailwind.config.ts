import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {},
      fontFamily: {
        anton: ["Anton", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
