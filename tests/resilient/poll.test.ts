/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `poll()` resilient tests.
 * @file poll.test.ts
 * @license AGPL-3.0-or-later
 */

import poll from '#root/src/poll';
import run from '#root/tests/resilient/runner';

describe('poll', () => {
  it('should be resilient', async () => {
    expect(await run(async () => {
      const timer = poll(() => {});
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          timer.stop();
          resolve();
        }, 0);
      });
    })).toBeTruthy();
  });
});
