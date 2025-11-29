/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `poll()` unit tests.
 * @file poll.test.ts
 * @license AGPL-3.0-or-later
 */

import poll from '#root/src/poll';
import sleep from '#root/src/sleep';

describe('poll', () => {
  test.concurrent('should run at interval', async () => {
    const log = jest.fn();
    const timer = poll(log, 2);
    await sleep(3);
    timer.stop();

    expect(log).toHaveBeenCalledTimes(1);
  });

  test.concurrent('should skip on congestion', async () => {
    let first = true;
    const log = jest.fn();
    const timer = poll(async (stopped) => {
      await sleep(first ? 2.05 : 0.15);
      first = false;
      if (!stopped()) {
        log();
      }
    }, 1, true);
    await sleep(10);
    timer.stop();

    expect(log.mock.calls.length).toBeGreaterThanOrEqual(1);
  });
});
