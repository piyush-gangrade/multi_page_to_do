/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['georgia ', 'serif'],
        normalText: ['cambria', 'serif']
      },
    },
  },
  daisyui: {
    themes: ["light", "dark", "retro", "lofi", "nord"],
  },
  plugins: [
    daisyui
  ],
}