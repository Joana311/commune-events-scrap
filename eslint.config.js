// @ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const eslint = require('@eslint/js');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const tseslint = require('typescript-eslint');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

// eslint-disable-next-line no-undef
module.exports = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    ignores: ['build/*'],
  },
];
