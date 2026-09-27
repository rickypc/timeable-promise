/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `toNumber()` resilient tests.
 * @file toNumber.test.ts
 * @license AGPL-3.0-or-later
 */

import toNumber from '#root/src/toNumber';
import run from '#root/tests/resilient/runner';

/**
 * Registers the resilient test suite for the `toNumber` function.
 * @param {typeof toNumber} fn - The toNumber implementation being tested.
 */
export default function testToNumber(fn: typeof toNumber) {
  describe('toNumber', () => {
    test('should be resilient', async () => {
      expect(await run(() => fn('0'))).toBeTruthy();
    });
  });
}

testToNumber(toNumber);
