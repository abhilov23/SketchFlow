import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * ESLint config for plain Node/TypeScript services (the http and ws backends).
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Required for the canonical Express `declare global { namespace Express {} }` augmentation.
      "@typescript-eslint/no-namespace": "off",
    },
  },
  {
    ignores: ["dist/**"],
  },
];
