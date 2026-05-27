/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        black: "#000",

        primary: {
          DEFAULT: '#464BAA',
          light: '#7B8FE0',
          dark: '#3B3F90',
        }
      },
      fontFamily: {
        inter: "Inter"
      }
    },
  },
  plugins: [],
}