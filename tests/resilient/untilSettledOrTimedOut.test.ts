/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `untilSettledOrTimedOut()` resilient tests.
 * @file untilSettledOrTimedOut.test.ts
 * @license AGPL-3.0-or-later
 */

import untilSettledOrTimedOut from '#root/src/untilSettledOrTimedOut';
import run from '#root/tests/resilient/runner';

/**
 * Registers the resilient test suite for the `untilSettledOrTimedOut` function.
 * @param {typeof untilSettledOrTimedOut} fn - The untilSettledOrTimedOut implementation being
 *   tested.
 */
export default function testUntilSettledOrTimedOut(fn: typeof untilSettledOrTimedOut) {
  describe('untilSettledOrTimedOut', () => {
    test('should be resilient', async () => {
      expect(
        await run(async () => {
          await fn(
            (resolve) => resolve('executor'),
            (resolve) => resolve('timeout'),
            // 1ns.
            0.000001,
          );
        }),
      ).toBeTruthy();
    });
  });
}

testUntilSettledOrTimedOut(untilSettledOrTimedOut);
