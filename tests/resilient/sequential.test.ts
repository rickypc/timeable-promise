/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `sequential()` resilient tests.
 * @file sequential.test.ts
 * @license AGPL-3.0-or-later
 */

import run from '#root/tests/resilient/runner';
import sequential from '#root/src/sequential';

describe('sequential', () => {
  test('should be resilient', async () => {
    expect(await run(() => sequential(['a', 'b', 'c'], (value) => value, 2)))
      .toBeTruthy();
  });
});
