/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: { 950: '#03030a', 900: '#07070f', 800: '#0d0d1a', 700: '#131327', 600: '#1a1a35', 500: '#222248' },
        neon: { purple: '#9d4edd', blue: '#4361ee', cyan: '#4cc9f0', green: '#06d6a0', yellow: '#ffd60a', orange: '#ff6b35', pink: '#f72585', red: '#ef233c' },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Rajdhani', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
        'slide-up':   'slideUp 0.4s ease-out',
      },
      keyframes: {
        float:   { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
