/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
        fontFamily: {
      'bebas': ['"Bebas Neue"', 'sans-serif'],
      'bellota-light': ['BellotaText-Light', 'sans-serif'],
      'SIMPLIFICA_Typeface': ['SIMPLIFICA_Typeface', 'sans-serif'],
    },
    },
  },
  plugins: [],
}