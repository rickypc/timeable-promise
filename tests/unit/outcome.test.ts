/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `outcome()` unit tests.
 * @file outcome.test.ts
 * @license AGPL-3.0-or-later
 */

import outcome from '#root/src/outcome';

describe('outcome', () => {
  test('should resolve with fulfilled status and value', async () => {
    expect(await outcome(async (x: number, y: number) => x + y, 2, 3, [2]))
      .toEqual({ status: 'fulfilled', value: 5 });
  });

  test('should resolve with rejected status and reason', async () => {
    const reason = new Error('failure');
    expect(await outcome(async () => { throw reason; }, 2, 3, [2]))
      .toEqual({ reason, status: 'rejected' });
  });

  test('should handle string results correctly', async () => {
    expect(await outcome(async (name: string) => `Hello, ${name}`, 'Alice', 1, ['Alice']))
      .toEqual({ status: 'fulfilled', value: 'Hello, Alice' });
  });

  test('should propagate rejection reasons of any type', async () => {
    const reason = new Error('bad reason');
    expect(await outcome(async () => { throw reason; }, '', 1, ['']))
      .toEqual({ reason, status: 'rejected' });
  });
});
