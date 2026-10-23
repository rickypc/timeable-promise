/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `poll()` resilient tests.
 * @file poll.test.ts
 * @license AGPL-3.0-or-later
 */

import poll from '#root/src/poll';
import run from '#root/tests/resilient/runner';

/**
 * Registers the resilient test suite for the `poll` function.
 * @param {typeof poll} fn - The poll implementation being tested.
 */
export default function testPoll(fn: typeof poll) {
  describe('poll', () => {
    test('should be resilient', async () => {
      expect(
        await run(async () => {
          const timer = fn(() => {});
          await new Promise<void>((resolve) => {
            setTimeout(() => {
              timer.stop();
              resolve();
            }, 0);
          });
        }),
      ).toBeTruthy();
    });

    test('should be resilient with immediate start', async () => {
      expect(
        await run(
          async () => {
            const timer = fn(
              (stopped) => {
                stopped();
              },
              1000,
              true,
            );
            await Bun.sleep(20);
            timer.stop();
          },
          { perf: 0.05 },
        ),
      ).toBeTruthy();
    });
  });
}

testPoll(poll);
