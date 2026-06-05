/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        astra: {
          bg: 'rgb(var(--astra-bg) / <alpha-value>)',
          surface: 'rgb(var(--astra-surface) / <alpha-value>)',
          panel: 'rgb(var(--astra-panel) / <alpha-value>)',
          border: 'rgb(var(--astra-border) / <alpha-value>)',
          primary: 'rgb(var(--astra-primary) / <alpha-value>)',
          accent: 'rgb(var(--astra-accent) / <alpha-value>)',
          muted: 'rgb(var(--astra-muted) / <alpha-value>)',
          text: 'rgb(var(--astra-text) / <alpha-value>)',
          glow: '#818cf8',
          danger: '#ef4444',
          warning: '#f59e0b',
          success: '#10b981',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.06)',
        'card-dark': '0 0 0 1px rgb(36 48 71 / 0.8)',
      },
    },
  },
  plugins: [],
};
