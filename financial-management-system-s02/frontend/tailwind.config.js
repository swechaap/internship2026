/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(37,99,235,0.12), 0 18px 50px rgba(15,23,42,0.12)',
      },
      colors: {
        surface: 'var(--surface)',
        panel: 'var(--panel)',
        line: 'var(--line)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        primary: 'var(--primary)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        display: ['"Manrope"', 'ui-sans-serif', 'system-ui'],
        body: ['"Inter Tight"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
