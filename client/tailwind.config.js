/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ["NanumSquareNeo-Variable", "sans-serif"],
        content: ["Pretendard-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
};
