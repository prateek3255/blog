module.exports = {
  purge: {
    mode: "all",
    content: ["./**/*.html"],
    options: {
      whitelist: [],
    },
  },
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'accent-blue': '#46CBE8'
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active']
    }
  },
  plugins: [require("@tailwindcss/typography")],
};
