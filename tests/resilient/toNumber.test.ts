/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `toNumber()` resilient tests.
 * @file toNumber.test.ts
 * @license AGPL-3.0-or-later
 */

import run from '#root/tests/resilient/runner';
import toNumber from '#root/src/toNumber';

describe('toNumber', () => {
  it('should be resilient', async () => {
    expect(await run(() => toNumber('0'))).toBeTruthy();
  });
});
