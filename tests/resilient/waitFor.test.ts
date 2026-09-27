/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `waitFor()` resilient tests.
 * @file waitFor.test.ts
 * @license AGPL-3.0-or-later
 */

import waitFor from '#root/src/waitFor';
import run from '#root/tests/resilient/runner';

/**
 * Registers the resilient test suite for the `waitFor` function.
 * @param {typeof waitFor} fn - The waitFor implementation being tested.
 */
export default function testWaitFor(fn: typeof waitFor) {
  describe('waitFor', () => {
    test('should be resilient', async () => {
      // 1ns.
      expect(await run(() => fn(() => true, 0.000001, 0.000001))).toBeTruthy();
    });
  });
}

testWaitFor(waitFor);
