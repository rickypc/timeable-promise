/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description ESLint settings.
 * @file eslint.config.js
 * @license AGPL-3.0-or-later
 */

import parser from '@typescript-eslint/parser';
import type { Linter } from 'eslint';
import * as jsdoc from 'eslint-plugin-jsdoc';
import security from 'eslint-plugin-security';

const config: Linter.Config[] = [
  // Order Matters™!
  { ignores: ['dist', 'supports'] },
  jsdoc.configs['flat/recommended'],
  security.configs.recommended,
  {
    rules: {
      'jsdoc/check-tag-names': ['error', { definedTags: ['packageDocumentation', 'ts-check'] }],
    },
  },
  { files: ['**/*.ts'], languageOptions: { ecmaVersion: 2024, parser, sourceType: 'module' } },
];

export default config;
