/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Resilient tests for example.ts.
 * @file example.test.ts
 * @license AGPL-3.0-or-later
 */

import run from '#root/tests/resilient/runner';

const example = require('#root/src/example');

describe('example.ts', () => {
  test('should be resilient', async () => {
    // Use direct reassignment to avoid extra memory overhead in leak tests.
    // eslint-disable-next-line no-console
    const original = console.log;
    // eslint-disable-next-line no-console
    console.log = () => {};
    // 60000ns.
    expect(await run(async () => example(), { leak: 3072, perf: 0.0060 })).toBeTruthy();
    // eslint-disable-next-line no-console
    console.log = original;
  });
});
