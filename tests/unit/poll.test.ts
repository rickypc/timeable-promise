/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `poll()` unit tests.
 * @file poll.test.ts
 * @license AGPL-3.0-or-later
 */

import { poll } from '#root/src/poll';
import { sleep } from '#root/src/sleep';

describe('poll', () => {
  afterEach(() => jest.useRealTimers());
  beforeEach(() => jest.useFakeTimers());

  it('should run at interval', async () => {
    const log = jest.fn();
    const timer = poll(log);
    setTimeout(() => timer.stop(), 1100);
    await jest.advanceTimersByTimeAsync(1100);

    expect(log).toHaveBeenCalledTimes(1);
  });

  it('should skip on congestion', async () => {
    let count = 1;
    const log = jest.fn();
    const timer = poll(async (stopped) => {
      const promise = sleep(98 + count);
      await jest.advanceTimersByTimeAsync(98 + count);
      await promise;
      if (!stopped()) {
        log();
        count += 1;
      }
    }, 100, true);
    setTimeout(() => timer.stop(), 1000);
    await jest.advanceTimersByTimeAsync(1000);

    expect(log).toHaveBeenCalledTimes(5);
  });
});
