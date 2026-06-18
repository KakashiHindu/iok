/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fff8ea',
        beige: '#f4e1c1',
        honey: '#f7c873',
        apricot: '#f39b6d',
        cocoa: '#5f4b32',
        ink: '#2d2118',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(95, 75, 50, 0.14)',
      },
    },
  },
  plugins: [],
};
