/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Jest settings.
 * @file jest.config.js
 * @license AGPL-3.0-or-later
 */

import type { Config } from '@jest/types';

process.env.TZ = 'UTC';

export default (): Config.InitialOptions => {
  const base: Config.InitialOptions = {
    clearMocks: true,
    collectCoverage: false,
    moduleNameMapper: { '^timeable-promise$': '<rootDir>/src/index.ts' },
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
    testEnvironment: 'node',
    testRegex: 'tests/resilient/.*.test.ts$',
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
  const overrides: Config.InitialOptions = {
    collectCoverage: true,
    collectCoverageFrom: ['src/*.ts'],
    coverageDirectory: '<rootDir>/coverage/',
    coverageReporters: ['cobertura', 'lcov', 'text'],
    errorOnDeprecated: true,
    logHeapUsage: true,
    testRegex: 'tests/unit/.*.test.ts$',
  };
  return process.env.RESILIENT_TYPE ? base : { ...base, ...overrides };
};
