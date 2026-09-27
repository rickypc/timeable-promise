/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `consecutives()` resilient tests.
 * @file consecutives.test.ts
 * @license AGPL-3.0-or-later
 */

import consecutives from '#root/src/consecutives';
import run from '#root/tests/resilient/runner';

/**
 * Registers the resilient test suite for the `consecutives` function.
 * @param {typeof consecutives} fn - The consecutives implementation being tested.
 */
export default function testConsecutives(fn: typeof consecutives) {
  describe('consecutives', () => {
    test('should be resilient', async () => {
      expect(await run(() => fn([['a', 'b'], ['c']], (value) => value))).toBeTruthy();
    });
  });
}

testConsecutives(consecutives);
