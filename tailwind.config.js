/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["var(--font-bn)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    logs: false,
    themes: [
      {
        bazar: {
          primary: "#05893e",
          "primary-content": "#ffffff",
          secondary: "#1a9951",
          accent: "#f59e0b",
          neutral: "#1d271f",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f0f5f0",
          "base-300": "#e1e8e1",
          "base-content": "#1d271f",
          info: "#4285f4",
          success: "#1a9951",
          warning: "#f59e0b",
          error: "#d03739",
        },
      },
    ],
  },
};
