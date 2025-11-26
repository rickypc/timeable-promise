/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `sleep()` unit tests.
 * @file sleep.test.ts
 * @license AGPL-3.0-or-later
 */

import { hrtimeToMs } from '#root/tests/utils';
import sleep from '#root/src/sleep';

describe('sleep', () => {
  // Concurrent for style; single test runs like sequential.
  test.concurrent('should idle', async () => {
    const begin = process.hrtime();
    await sleep(1);
    const end = process.hrtime(begin);

    expect(hrtimeToMs(end)).toBeGreaterThan(0.5);
  });
});
