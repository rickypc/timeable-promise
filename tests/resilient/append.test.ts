/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `append()` resilient tests.
 * @file append.test.ts
 * @license AGPL-3.0-or-later
 */

import append from '#root/src/append';
import run from '#root/tests/resilient/runner';

describe('append', () => {
  it('should be resilient', async () => {
    expect(await run(() => append([1, 2], [3, 4]))).toBeTruthy();
  });
});
