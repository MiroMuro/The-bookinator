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
        timedOutDialogPopUp: {
          "0%": {
            top: -600,
            opacity: 0,
          },
        },
      },
      animation: {
        scaleUpAndDown: "scaleUpAndDown 1s ease-in-out forwards",
        timedOutDialogPopUp: "timedOutDialogPopUp 1s ease-in-out forwards",
      },
    },
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "800px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    flex: {
      2: "2 2 100%",
    },
  },
  plugins: [],
};
