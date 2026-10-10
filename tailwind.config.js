/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#635BFF', dark: '#4B43E0', soft: '#EEEDFF' },
        ink: '#111827',
        muted: '#64748B',
        app: '#F8FAFC',
        night: '#0F172A',
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.05)',
        lift: '0 12px 40px rgba(99,91,255,0.22)',
      },
      screens: {
        '3xl': '1440px',
      },
    },
  },
  plugins: [],
};
