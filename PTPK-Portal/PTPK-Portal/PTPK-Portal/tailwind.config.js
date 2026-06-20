/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0d1b2a',
          light: '#1a2e45',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light: '#f0d080',
        },
        teal: {
          DEFAULT: '#0f6e6e',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
