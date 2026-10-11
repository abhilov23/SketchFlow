import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";

/**
 * A shared ESLint configuration for the repository.
 *
 * Errors are real errors — no `only-warn` downgrade. Every package that opts into
 * a `lint` script runs it with `--max-warnings 0`, which would be meaningless if
 * warnings were the only thing this produced.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  {
    ignores: ["dist/**", "node_modules/**", ".next/**", ".turbo/**"],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
];
