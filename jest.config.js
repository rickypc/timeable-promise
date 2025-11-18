/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Jest settings.
 * @file jest.config.js
 * @license AGPL-3.0-or-later
 */

process.env.TZ = 'UTC';

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/*.ts'],
  coverageDirectory: './coverage/',
  coverageReporters: ['cobertura', 'lcov', 'text'],
  errorOnDeprecated: true,
  logHeapUsage: true,
  testEnvironment: 'node',
  testRegex: 'tests/unit/.*.test.ts$',
  transform: {
    '^.+\\.ts$': [
      '@swc/jest',
      {
        jsc: {
          parser: { decorators: true, syntax: 'typescript' },
          target: 'es2024',
        },
      },
    ],
  },
};
