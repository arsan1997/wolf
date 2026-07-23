/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fantasy: {
          dark: '#0a0914',
          panel: '#131124',
          card: '#1b1736',
          border: '#2e2759',
          blood: '#dc2626',
          moon: '#38bdf8',
          gold: '#fbbf24'
        }
      },
      fontFamily: {
        sans: ['Kanit', 'Prompt', 'sans-serif']
      }
    },
  },
  plugins: [],
}
