/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description ESLint settings.
 * @file eslint.config.js
 * @license AGPL-3.0-or-later
 */

import type { Linter } from 'eslint';
import jest from 'eslint-plugin-jest';
import jsdoc from 'eslint-plugin-jsdoc';
import noSecrets from 'eslint-plugin-no-secrets';
import security from 'eslint-plugin-security';
import yml from 'eslint-plugin-yml';
import ts from 'typescript-eslint';
import * as ymlParser from 'yaml-eslint-parser';

const config: Linter.Config[] = [
  // Order Matters™!
  { ignores: ['{dist,supports}/'] },
  ...ts.configs.recommended,
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
    plugins: { 'no-secrets': noSecrets },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'jsdoc/check-tag-names': ['error', { definedTags: ['packageDocumentation', 'ts-check'] }],
    },
  },
];

export default config;
