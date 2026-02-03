import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2b3072",
        background: "#f5f5f5",
        muted: "#6b7280",
      },
    },
  },
  plugins: [],
};

export default config;
