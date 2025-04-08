/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",               // For Vite or if index.html is at the root
    "./public/index.html",        // For CRA
    "./src/**/*.{js,ts,jsx,tsx}", // All source files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}