/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `outcome()` unit tests.
 * @file outcome.test.ts
 * @license AGPL-3.0-or-later
 */

import outcome from '#root/src/outcome';

// eslint-disable-next-line jest/no-export,jsdoc/require-jsdoc
export default function testOutcome(fn: typeof outcome) {
  describe('outcome', () => {
    test.concurrent('should resolve with fulfilled status and value', async () => {
      expect(await fn((async (x: number, y: number) => x + y) as any, 2 as any, 3, [2] as any))
        .toEqual({ status: 'fulfilled', value: 5 });
    });

    test.concurrent('should resolve with rejected status and reason', async () => {
      const reason = new Error('failure');
      expect(await fn(async () => { throw reason; }, 2 as any, 3, [2] as any))
        .toEqual({ reason, status: 'rejected' });
    });

    test.concurrent('should handle string results correctly', async () => {
      expect(await fn((async (name: string) => `Hello, ${name}`) as any, 'Alice' as any, 1, ['Alice'] as any))
        .toEqual({ status: 'fulfilled', value: 'Hello, Alice' });
    });

    test.concurrent('should propagate rejection reasons of any type', async () => {
      const reason = new Error('bad reason');
      expect(await fn(async () => { throw reason; }, '' as any, 1, [''] as any))
        .toEqual({ reason, status: 'rejected' });
    });
  });
}

testOutcome(outcome);
