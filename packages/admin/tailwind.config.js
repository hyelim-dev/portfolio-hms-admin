const { nextui } = require('@nextui-org/react')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      md: '769px',
    },
    extend: {
      width: {
        web: '1440px',
      },
      colors: {
        primary: '#4e81ef',
        secondary: '#07bbae',
        tertiary: '#7859bf',
        accent: '#d45394',
        gray: '#71717a',
        lightGray: '#d4d4d8',
        black: '#11181c',
        offWhite: '#eee',
        red: '#FF0086',
        lightPrimary: '#d9e3fa',
        mainBG: '#dbe5fb',
        lightYellow: '#fffff9',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      addCommonColors: true,
    }),
  ],
}
