/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `consecutive()` resilient tests.
 * @file consecutive.test.ts
 * @license AGPL-3.0-or-later
 */

import { consecutive } from '#root/src/consecutive';
import { run } from '#root/tests/resilient/runner';

describe('consecutive', () => {
  it('should be resilient', async () => {
    expect(await run(() => consecutive(['a', 'b', 'c'], (value) => value, 2)))
      .toBeTruthy();
  });
});
