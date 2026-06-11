/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#e40000',
        secondary: '#e89f00',
        success: {
          DEFAULT: '#16a34a',
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      fontWeight: {
        black: '900',
        extrabold: '800',
        medium: '500',
      },
      keyframes: {
        'loading-bar': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(500%)' },
        },
      },
      animation: {
        'loading-bar': 'loading-bar 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
