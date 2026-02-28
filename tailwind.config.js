/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'zawer-danger': '#ef4444',
        'zawer-warning': '#f97316',
        'zawer-neutral': '#eab308',
        'zawer-safe': '#22c55e',
        'zawer-excellent': '#10b981',
      },
    },
  },
  plugins: [],
}

