/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `parallel()` resilient tests.
 * @file parallel.test.ts
 * @license AGPL-3.0-or-later
 */

import parallel from '#root/src/parallel';
import run from '#root/tests/resilient/runner';

/**
 * Registers the resilient test suite for the `parallel` function.
 * @param {typeof parallel} fn - The parallel implementation being tested.
 */
export default function testParallel(fn: typeof parallel) {
  describe('parallel', () => {
    test('should be resilient', async () => {
      expect(await run(() => fn(['a', 'b', 'c'], (value) => value, 2))).toBeTruthy();
    });
  });
}

testParallel(parallel);
