/** @type {import('tailwindcss').Config} */
import tailwindScrollbar from 'tailwind-scrollbar';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        theme : {
          100: '#212121', // Dark Gray 1
          200: '#383838', // Dark Gray 2
          300: '#121212', // Dark Gray 3
          400: '#3A3A3A', // Dark Gray 4
          500 : '#4a4a4a'
        },
      }
    },
  },
  plugins: [
    tailwindScrollbar
  ],
}
