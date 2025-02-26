import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "indent": ["error", 2],
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "arrow-spacing": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "no-multiple-empty-lines": ["error", { max: 1, "maxEOF": 0 }],
      "no-multi-spaces": "error",
      "function-paren-newline": ["error", "consistent"],
      "implicit-arrow-linebreak": ["error", "beside"],
      "object-curly-newline": ["error", { "multiline": true, "consistent": true }],
      "object-curly-spacing": ["error", "always"],
      "arrow-parens": ["error", "always"],
      "arrow-body-style": ["error", "as-needed"],
      "prefer-template": "error",
      "no-useless-catch": "off"
    }
  },
];