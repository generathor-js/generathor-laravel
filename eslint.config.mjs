import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {files: ["src/*.{js,mjs,cjs,ts}"]},
  {ignores: ["dist/**/*", "generathor.config.js"]},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended
];