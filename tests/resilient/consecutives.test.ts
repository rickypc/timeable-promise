/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `consecutives()` resilient tests.
 * @file consecutives.test.ts
 * @license AGPL-3.0-or-later
 */

import consecutives from '#root/src/consecutives';
import run from '#root/tests/resilient/runner';

describe('consecutives', () => {
  it('should be resilient', async () => {
    expect(await run(() => consecutives([['a', 'b'], ['c']], (value) => value)))
      .toBeTruthy();
  });
});
