/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `outcome()` resilient tests.
 * @file outcome.test.ts
 * @license AGPL-3.0-or-later
 */

import outcome, { type ItemExecutor } from '#root/src/outcome';
import run from '#root/tests/resilient/runner';

describe('outcome', () => {
  test('should be resilient', async () => {
    const executor: ItemExecutor<number> = (async (x: number, y: number) => x + y) as any;
    expect(await run(() => outcome(executor, 2 as any, 3, [2] as any))).toBeTruthy();
  });
});
