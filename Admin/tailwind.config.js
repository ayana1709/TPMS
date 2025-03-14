/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        login:
          "linear-gradient(rgba(0, 128, 0, 0.7), rgba(0, 128, 0, 0.7)), url('/images/addis.jpg')",
      },
    },
  },
  plugins: [],
};
