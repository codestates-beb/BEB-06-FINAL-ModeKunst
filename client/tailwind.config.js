/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
    },
    extend: {
      fontFamily: {
        title: ["NanumSquareNeo-Variable", "sans-serif"],
        content: ["Pretendard-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
};
