/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `append()` resilient tests.
 * @file append.test.ts
 * @license AGPL-3.0-or-later
 */

import append from '#root/src/append';
import run from '#root/tests/resilient/runner';

// eslint-disable-next-line jest/no-export,jsdoc/require-jsdoc
export default function testAppend(fn: typeof append) {
  describe('append', () => {
    test('should be resilient', async () => {
      expect(await run(() => fn([1, 2], [3, 4]))).toBeTruthy();
    });
  });
}

testAppend(append);
