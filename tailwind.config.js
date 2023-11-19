import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#a1b6c4',
        secondary: '#2797d6',
        background: '#CEDAE2',
        confirm: '#4BB051',
        confirmlight: '#a9fcae'
      },
      fontSize: {
        '2xs': '.625rem', 
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}
