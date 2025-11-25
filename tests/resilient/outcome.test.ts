/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `outcome()` resilient tests.
 * @file outcome.test.ts
 * @license AGPL-3.0-or-later
 */

import { type ArrayExecutor, outcome } from '#root/src/outcome';
import { run } from '#root/tests/resilient/runner';

describe('outcome', () => {
  it('should be resilient', async () => {
    const executor: ArrayExecutor<number> = async (x: number, y: number) => x + y;
    expect(await run(() => outcome(executor, 2, 3, [2]))).toBeTruthy();
  });
});
