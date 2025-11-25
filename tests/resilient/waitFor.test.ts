/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `waitFor()` resilient tests.
 * @file waitFor.test.ts
 * @license AGPL-3.0-or-later
 */

import run from '#root/tests/resilient/runner';
import waitFor from '#root/src/waitFor';

describe('waitFor', () => {
  it('should be resilient', async () => {
    // 1ns.
    expect(await run(() => waitFor(() => true, 0.000001, 0.000001))).toBeTruthy();
  });
});
