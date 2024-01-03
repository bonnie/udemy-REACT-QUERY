const vitest = require("eslint-plugin-vitest");

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        paths: ["src"],
      },
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:vitest/recommended",
    "plugin:testing-library/react",
    // "plugin:@tanstack/eslint-plugin-query/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh", "simple-import-sort"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    // we're using TypeScript here, not propTypes!
    "react/prop-types": "off",

    // obscure error that we don't need
    "react/display-name": "off",

    // to avoid "no-unused-vars" warnings in function type declarations
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "warn",

    // imports
    "import/prefer-default-export": 0,
    "import/no-anonymous-default-export": 0,

    // sort alias imports that start with `@` separately from modules that start with `@`
    "simple-import-sort/imports": [
      "warn",
      {
        groups: [["^\\u0000"], ["^@?\\w"], ["^@src", "^@shared"], ["^\\."]],
      },
    ],
    "simple-import-sort/exports": "warn",
    "sort-imports": "off",
    "import/order": "off",

    // eliminate distracting red squiggles while writing tests
    "vitest/expect-expect": "off",
  },
  // don't flag vitest globals like `describe` and `test`
  globals: {
    ...vitest.environments.env.globals,
  },
};
