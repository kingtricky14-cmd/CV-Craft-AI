/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          500: '#3b5bfd',
          600: '#2f47e0',
          700: '#2536b3',
        },
      },
    },
  },
  plugins: [],
};
