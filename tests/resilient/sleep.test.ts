/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `sleep()` resilient tests.
 * @file sleep.test.ts
 * @license AGPL-3.0-or-later
 */

import sleep from '#root/src/sleep';
import run from '#root/tests/resilient/runner';

// eslint-disable-next-line jest/no-export,jsdoc/require-jsdoc
export default function testSleep(fn: typeof sleep) {
  describe('sleep', () => {
    test('should be resilient', async () => {
      // 1ns.
      expect(await run(() => fn(0.000001))).toBeTruthy();
    });
  });
}

testSleep(sleep);
