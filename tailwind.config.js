/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "inter": "Inter"
      }
    },
  },
  daisyui: {
    themes: [
      {
        lugatheme: {
          "primary": "#1a5cff",
          "secondary": "#20242D",
          "secondary-content": "#5B657E",
          "accent": "#37cdbe",
          "neutral": "#363F54",
          "base-100": "#17181c",
          "base-content": "#93A0B9",
          "base-200": "#17181c",
        },
      },
    ]
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require("@tailwindcss/typography"),
    // eslint-disable-next-line no-undef
    require('daisyui'),
  ],
}

