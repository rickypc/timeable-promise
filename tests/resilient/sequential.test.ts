/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `sequential()` resilient tests.
 * @file sequential.test.ts
 * @license AGPL-3.0-or-later
 */

import sequential from '#root/src/sequential';
import run from '#root/tests/resilient/runner';

/**
 * Registers the resilient test suite for the `sequential` function.
 * @param {typeof sequential} fn - The sequential implementation being tested.
 */
export default function testSequential(fn: typeof sequential) {
  describe('sequential', () => {
    test('should be resilient', async () => {
      expect(await run(() => fn(['a', 'b', 'c'], (value) => value, 2))).toBeTruthy();
    });
  });
}

testSequential(sequential);
