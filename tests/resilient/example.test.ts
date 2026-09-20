/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description Resilient tests for example.ts.
 * @file example.test.ts
 * @license AGPL-3.0-or-later
 */

import run from '#root/tests/resilient/runner';

const example = require('#root/src/example');

describe('example.ts', () => {
  test('should be resilient', async () => {
    // Use direct reassignment to avoid extra memory overhead in leak tests.
    const original = console.log;
    console.log = () => {};
    // 100000ns.
    expect(await run(async () => example(), { leak: 3072, perf: 0.01 })).toBeTruthy();
    console.log = original;
  });
});
