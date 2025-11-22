/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description ESLint settings.
 * @file eslint.config.js
 * @license AGPL-3.0-or-later
 */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import jest from 'eslint-plugin-jest';
import js from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';
import { type Linter } from 'eslint';
import noSecrets from 'eslint-plugin-no-secrets';
import security from 'eslint-plugin-security';
import ts from 'typescript-eslint';
import yml from 'eslint-plugin-yml';
import ymlParser from 'yaml-eslint-parser';

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });
const config: Linter.Config[] = [
  // Order Matters™!
  { ignores: ['{dist,supports}/'] },
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

export default config;
