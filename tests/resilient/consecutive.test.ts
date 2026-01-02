/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `consecutive()` resilient tests.
 * @file consecutive.test.ts
 * @license AGPL-3.0-or-later
 */

import consecutive from '#root/src/consecutive';
import run from '#root/tests/resilient/runner';

// eslint-disable-next-line jest/no-export,jsdoc/require-jsdoc
export default function testConsecutive(fn: typeof consecutive) {
  describe('consecutive', () => {
    test('should be resilient', async () => {
      expect(await run(() => fn(['a', 'b', 'c'], (value) => value, 2)))
        .toBeTruthy();
    });
  });
}

testConsecutive(consecutive);
