/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `untilSettledOrTimedOut()` resilient tests.
 * @file untilSettledOrTimedOut.test.ts
 * @license AGPL-3.0-or-later
 */

import run from '#root/tests/resilient/runner';
import untilSettledOrTimedOut from '#root/src/untilSettledOrTimedOut';

describe('untilSettledOrTimedOut', () => {
  it('should be resilient', async () => {
    expect(await run(async () => {
      await untilSettledOrTimedOut(
        (resolve) => resolve('executor'),
        (resolve) => resolve('timeout'),
        // 1ns.
        0.000001,
      );
    })).toBeTruthy();
  });
});
