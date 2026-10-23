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
    // 275000ns.
    expect(await run(async () => example(), { leak: 3072, perf: 0.0275 })).toBeTruthy();
    console.log = original;
  });

  test('should auto-run when NODE_ENV is spawn', async () => {
    const env = process.env.NODE_ENV;
    const original = console.log;
    process.env.NODE_ENV = 'spawn';
    console.log = () => {};
    const spawned = await import(`#root/src/example?update=${Date.now()}`);
    expect(await spawned.default()).toBe('Timeable Promise Examples');
    console.log = original;
    process.env.NODE_ENV = env;
  });
});
