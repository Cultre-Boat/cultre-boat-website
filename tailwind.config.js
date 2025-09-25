/** @type {import('tailwindcss').Config} */
export default{
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Add these to support your path aliases
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'bellota-light': ['BellotaText-Light', 'sans-serif'],
      },
    },
  },
  plugins: [],
}