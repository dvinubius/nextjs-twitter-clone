/** @type {import("prettier").Config} */
const config = {
  "printWidth": 80,
  "semi": true,
  "singleQuote": true,
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
};

module.exports = config;
