/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `outcome()` unit tests.
 * @file outcome.test.ts
 * @license AGPL-3.0-or-later
 */

import outcome, { type ArrayExecutor } from '#root/src/outcome';

describe('outcome', () => {
  it('should resolve with fulfilled status and value', async () => {
    const executor: ArrayExecutor<number> = async (x: number, y: number) => x + y;

    const result = await outcome(executor, 2, 3, [2]);

    expect(result).toEqual({ status: 'fulfilled', value: 5 });
  });

  it('should resolve with rejected status and reason', async () => {
    const error = new Error('failure');
    const executor: ArrayExecutor<number> = async () => {
      throw error;
    };

    const result = await outcome(executor, 2, 3, [2]);

    expect(result).toEqual({ reason: error, status: 'rejected' });
  });

  it('should handle string results correctly', async () => {
    const executor: ArrayExecutor<string> = async (name: string) => `Hello, ${name}`;

    const result = await outcome(executor, 'Alice', 1, ['Alice']);

    expect(result).toEqual({ status: 'fulfilled', value: 'Hello, Alice' });
  });

  it('should propagate rejection reasons of any type', async () => {
    const executor: ArrayExecutor<string> = async () => {
      throw new Error('bad reason');
    };

    const result = await outcome(executor, '', 1, ['']);

    expect(result).toEqual({ reason: new Error('bad reason'), status: 'rejected' });
  });
});
