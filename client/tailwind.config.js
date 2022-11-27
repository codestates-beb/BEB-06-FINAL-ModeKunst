/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      // 이전까지는 모바일
      tablet: "770px", // ~ 1279px 태블릿
      desktop: "1280px", // ~ 큰 데스크탑
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
