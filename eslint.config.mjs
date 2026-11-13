import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  { files: ["scripts/**/*.js"], languageOptions: { globals: globals.browser } },
  { files: ["tests/**/*.js"], languageOptions: { globals: globals.node } },
]);
