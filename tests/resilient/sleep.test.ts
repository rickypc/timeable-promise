/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `sleep()` resilient tests.
 * @file sleep.test.ts
 * @license AGPL-3.0-or-later
 */

import { run } from '#root/tests/resilient/runner';
import { sleep } from '#root/src/sleep';

describe('sleep', () => {
  it('should be resilient', async () => {
    // 1ns.
    expect(await run(() => sleep(0.000001))).toBeTruthy();
  });
});
