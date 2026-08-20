import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    // `.next*/**`, not `.next/**`: a `next build --distDir` run (or a stale
    // directory left behind by one) drops generated code beside it that lints
    // with hundreds of errors nobody can act on.
    ignores: ["node_modules/**", ".next*/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
