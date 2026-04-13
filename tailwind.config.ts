import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cairo", "sans-serif"],
        calibri: ["CalibryCustom"],
      },
    },
  },
};

export default config;
