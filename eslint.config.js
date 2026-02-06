const { FlatCompat } = require("@eslint/eslintrc");
const path = require("path");
const { fileURLToPath } = require("url");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

module.exports = eslintConfig;
