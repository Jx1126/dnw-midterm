/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*.{html,js,ejs}'],
  theme: {
    extend: {
      colors: {
        'primary-color': '#414A5B',
        'secondary-color': '#6B7280',
        'secondary-hover-color': '#7d8296'
      }
    },
  },
  plugins: [require('daisyui'),],
  daisyui: {
    themes: ["nord"],
  },
}