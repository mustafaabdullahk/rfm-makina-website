/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'scrollbar-blue',
    'scrollbar-green',
    'scrollbar-red',
    'scrollbar-orange',
    // Eğer başka renkler eklediyseniz, onları da buraya ekleyin
  ],
};