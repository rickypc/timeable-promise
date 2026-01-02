/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `outcome()` resilient tests.
 * @file outcome.test.ts
 * @license AGPL-3.0-or-later
 */

import outcome, { type ItemExecutor } from '#root/src/outcome';
import run from '#root/tests/resilient/runner';

// eslint-disable-next-line jest/no-export,jsdoc/require-jsdoc
export default function testOutcome(fn: typeof outcome) {
  describe('outcome', () => {
    test('should be resilient', async () => {
      const executor: ItemExecutor<number> = (async (x: number, y: number) => x + y) as any;
      expect(await run(() => fn(executor, 2 as any, 3, [2] as any))).toBeTruthy();
    });
  });
}

testOutcome(outcome);
