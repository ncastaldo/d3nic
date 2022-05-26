module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2018
  },
  extends: ["eslint:recommended", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "no-unused-vars": "off",
    "no-func-assign": "off",
  },
};
