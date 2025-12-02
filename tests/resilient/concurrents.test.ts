/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `concurrents()` resilient tests.
 * @file concurrents.test.ts
 * @license AGPL-3.0-or-later
 */

import concurrents from '#root/src/concurrents';
import run from '#root/tests/resilient/runner';

// eslint-disable-next-line jest/no-export,jsdoc/require-jsdoc
export default function testConcurrents(fn: typeof concurrents) {
  describe('concurrents', () => {
    test('should be resilient', async () => {
      expect(await run(() => fn([['a', 'b'], ['c']], (value) => value)))
        .toBeTruthy();
    });
  });
}

testConcurrents(concurrents);
