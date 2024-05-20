/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        mammoth: "6rem",
      },
      fontFamily: {
        body: ["Teachers"],
      },
      keyframes: {
        scaleUpAndDown: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.5)" },
        },
      },
      animation: {
        scaleUpAndDown: "scaleUpAndDown 1s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
