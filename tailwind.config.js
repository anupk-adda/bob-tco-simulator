/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ibm: { blue: '#0F62FE', dark: '#001141' },
      },
    },
  },
  plugins: [],
}

