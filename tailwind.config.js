/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
        "white": "#fff",
        "navajowhite": "#ffd18f", // 👈 ⭐ 앞에 있던 느낌표(!)를 깨끗하게 지웠습니다!
        "black": "#000"
      },
      "fontFamily": {
        "inter": "Inter"
      }
    },
  },
  plugins: [],
}