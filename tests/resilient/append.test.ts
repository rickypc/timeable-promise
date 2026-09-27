/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `append()` resilient tests.
 * @file append.test.ts
 * @license AGPL-3.0-or-later
 */

import append from '#root/src/append';
import run from '#root/tests/resilient/runner';

/**
 * Registers the resilient test suite for the `append` function.
 * @param {typeof append} fn - The append implementation being tested.
 */
export default function testAppend(fn: typeof append) {
  describe('append', () => {
    test('should be resilient', async () => {
      expect(await run(() => fn([1, 2], [3, 4]))).toBeTruthy();
    });
  });
}

testAppend(append);
