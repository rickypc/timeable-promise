/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `parallel()` resilient tests.
 * @file parallel.test.ts
 * @license AGPL-3.0-or-later
 */

import parallel from '#root/src/parallel';
import run from '#root/tests/resilient/runner';

describe('parallel', () => {
  it('should be resilient', async () => {
    expect(await run(() => parallel(['a', 'b', 'c'], (value) => value, 2)))
      .toBeTruthy();
  });
});
