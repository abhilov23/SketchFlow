import { config } from "@repo/eslint-config/next-js";

export default [
  {
    // Next.js generates these; they are build output, not source.
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  ...config,
];