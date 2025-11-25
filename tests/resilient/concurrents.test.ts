/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `concurrents()` resilient tests.
 * @file concurrents.test.ts
 * @license AGPL-3.0-or-later
 */

import concurrents from '#root/src/concurrents';
import run from '#root/tests/resilient/runner';

describe('concurrents', () => {
  it('should be resilient', async () => {
    expect(await run(() => concurrents([['a', 'b'], ['c']], (value) => value)))
      .toBeTruthy();
  });
});
