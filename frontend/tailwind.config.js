/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#14192B', soft: '#4A5168', faint: '#8089A0' },
        paper: { DEFAULT: '#F5F7FA', raised: '#FFFFFF', sunk: '#EDF0F5' },
        line: '#E1E5EC',
        brand: { DEFAULT: '#0B6E6E', dark: '#085555', tint: '#E3F3F2' },
        mark: '#FFE27A',
        bug: { DEFAULT: '#C2362B', tint: '#FCEBE9' },
        fix: { DEFAULT: '#1E7A46', tint: '#E6F4EC' },
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: { lift: '0 1px 2px rgba(20,25,43,.06), 0 8px 24px -12px rgba(20,25,43,.18)' },
    },
  },
  plugins: [],
};
