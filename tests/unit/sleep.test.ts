/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `sleep()` unit tests.
 * @file sleep.test.ts
 * @license AGPL-3.0-or-later
 */

import { hrtimeToMs } from '#root/tests/utils';
import { sleep } from '#root/src/sleep';

describe('sleep', () => {
  afterEach(() => jest.useRealTimers());
  beforeEach(() => jest.useFakeTimers());

  it('should sleep', async () => {
    const begin = process.hrtime();
    const promise = sleep(100);
    await jest.advanceTimersByTimeAsync(100);
    await promise;
    const end = process.hrtime(begin);

    expect(hrtimeToMs(end)).toBeGreaterThan(50);
  });
});
