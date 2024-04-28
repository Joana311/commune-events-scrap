// @ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const eslint = require('@eslint/js');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const tseslint = require('typescript-eslint');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const jsdoc = require('eslint-plugin-jsdoc');

// eslint-disable-next-line no-undef
module.exports = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    ignores: ['build/*'],
  },
  // Note: jsdoc doesn't full work
  jsdoc.configs['flat/recommended-typescript'],
  {
    files: ['**/*.js'],
    plugins: {
      jsdoc,
    },
    rules: {
      indent: ['error', 2],
      'jsdoc/require-description': [
        1,
        {
          contexts: ['any'],
        },
      ],
      'jsdoc/require-description-complete-sentence': 1,
      'jsdoc/require-jsdoc': [
        1,
        {
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true,
          },
          contexts: [
            'TSClassProperty',
            'TSDeclareFunction',
            'TSEmptyBodyFunctionExpression',
            'TSEnumDeclaration',
            'TSInterfaceDeclaration',
            'TSMethodSignature',
            'TSPropertySignature',
            'TSTypeAliasDeclaration',
          ],
        },
      ],
      'linebreak-style': ['error', 'unix'],
      'prettier/prettier': 'error',
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
    },
  },
];
