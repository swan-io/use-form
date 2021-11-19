const { dependencies } = require("./package.json");
const path = require("path");

module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react-hooks/recommended",
  ],

  overrides: [
    {
      files: ["**/__{tests}__/**/*.{ts,tsx}"],
      env: { jest: true },
    },
  ],

  settings: {
    react: { version: dependencies.react },
  },
  parserOptions: {
    project: path.resolve(__dirname + "/tsconfig.json"),
  },

  rules: {
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
  },
};
