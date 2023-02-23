/** @type {import("prettier").Config} */
module.exports = {
  semi: true,
  trailingComma: "all",
  arrowParens: "avoid",
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
};
