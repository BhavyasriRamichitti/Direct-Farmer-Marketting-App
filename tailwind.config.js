/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}", // Adjust according to your project structure
    "./components/**/*.{js,jsx,ts,tsx}", // Include any other directories as needed
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
