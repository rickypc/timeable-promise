/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `chunk()` resilient tests.
 * @file chunk.test.ts
 * @license AGPL-3.0-or-later
 */

import { chunk } from '#root/src/chunk';
import { run } from '#root/tests/resilient/runner';

describe('chunk', () => {
  it('should be resilient', async () => {
    expect(await run(() => chunk([1, 2, 3], 2))).toBeTruthy();
  });
});
