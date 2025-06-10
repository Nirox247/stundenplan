// functions/.eslintrc.cjs
module.exports = {
  root: true, // <--- Make sure this is present and true!
  env: {
    es6: true,
    node: true,
  },
  extends: [
 "eslint:recommended",
    "google",
    "plugin:@typescript-eslint/recommended"
  ],
parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore compiled JS files
    "/.firebase/",
    "/node_modules/",
    "*.d.ts", // Ignore declaration files
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "indent": ["error", 2],
    "max-len": ["error", { "code": 120 }],
    "object-curly-spacing": "off",
  },
};