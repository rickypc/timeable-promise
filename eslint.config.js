/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description ESLint settings.
 * @file eslint.config.js
 * @license AGPL-3.0-or-later
 */

const { FlatCompat } = require('@eslint/eslintrc');
const globals = require('globals');
const jest = require('eslint-plugin-jest');
const js = require('@eslint/js');
const jsdoc = require('eslint-plugin-jsdoc');
const noSecrets = require('eslint-plugin-no-secrets');
const security = require('eslint-plugin-security');
const ts = require('typescript-eslint');
const yml = require('eslint-plugin-yml');
const ymlParser = require('yaml-eslint-parser');

const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = [
  // Order Matters™!
  { ignores: ['dist/'] },
  ...compat.config({ extends: ['airbnb-base'] }),
  js.configs.recommended,
  jest.configs['flat/recommended'],
  jest.configs['flat/style'],
  jsdoc.configs['flat/recommended'],
  security.configs.recommended,
  ...yml.configs['flat/recommended'],
  {
    files: ['*.yml'],
    languageOptions: { parser: ymlParser },
  },
  {
    languageOptions: { ecmaVersion: 2024, globals: { ...globals.browser } },
    plugins: { 'no-secrets': noSecrets },
    rules: {
      'import/extensions': ['error', 'ignorePackages', { js: 'never', ts: 'never' }],
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'jsdoc/check-tag-names': ['error', { definedTags: ['packageDocumentation', 'ts-check'] }],
    },
    settings: {
      // This applies to js, jsx, ts, tsx.
      'import/resolver': { typescript: true },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ...ts.configs.recommended[0],
    ...ts.configs.recommendedTypeChecked[0],
  },
];
