/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `concurrent()` resilient tests.
 * @file concurrent.test.ts
 * @license AGPL-3.0-or-later
 */

import concurrent from '#root/src/concurrent';
import run from '#root/tests/resilient/runner';

// eslint-disable-next-line jest/no-export,jsdoc/require-jsdoc
export default function testConcurrent(fn: typeof concurrent) {
  describe('concurrent', () => {
    test('should be resilient', async () => {
      expect(await run(() => fn(['a', 'b', 'c'], (value) => value, 2)))
        .toBeTruthy();
    });
  });
}

testConcurrent(concurrent);
