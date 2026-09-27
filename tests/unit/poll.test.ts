/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `poll()` unit tests.
 * @file poll.test.ts
 * @license AGPL-3.0-or-later
 */

import { mock } from 'bun:test';
import poll from '#root/src/poll';
import sleep from '#root/src/sleep';

/**
 * Registers the unit test suite for the `poll` function.
 * @param {typeof poll} fn - The poll implementation being tested.
 */
export default function testPoll(fn: typeof poll) {
  describe('poll', () => {
    test.concurrent('should run at interval', async () => {
      const log = mock();
      const timer = fn(log, 100);
      await sleep(120);
      timer.stop();

      expect(log).toHaveBeenCalledTimes(1);
    });

    test.concurrent('should skip on congestion', async () => {
      let first = true;
      const log = mock();
      const timer = fn(
        async (stopped) => {
          await sleep(first ? 200.05 : 15);
          first = false;
          if (!stopped()) {
            log();
          }
        },
        100,
        true,
      );
      await sleep(1000);
      timer.stop();

      expect(log.mock.calls.length).toBeGreaterThanOrEqual(1);
    });
  });
}

testPoll(poll);
