/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0f172a',
        darkPanel: '#1e293b',
        darkBorder: '#334155',
        primaryText: '#f8fafc',
        secondaryText: '#94a3b8',
        brandGreen: '#10b981',
        brandRed: '#ef4444',
        brandYellow: '#f59e0b',
        brandPurple: '#8b5cf6'
      }
    },
  },
  plugins: [],
}
