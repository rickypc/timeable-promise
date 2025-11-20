/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Wraps executor result into a settled outcome object.
 * @file outcome.ts
 * @license AGPL-3.0-or-later
 */

export type ArrayExecutor<T> = (
  // eslint-disable-next-line no-unused-vars
  value: T,
  // eslint-disable-next-line no-unused-vars
  index: number,
  // eslint-disable-next-line no-unused-vars
  array: T[],
  // eslint-disable-next-line no-unused-vars
  accumulator?: PromiseSettledResult<T>[]
) => T | Promise<T>;

export type Settled<T> = PromiseSettledResult<T>;

/**
 * Executes an executor and returns a PromiseSettledResult-like outcome.
 * @example
 * _Fulfilled outcome:_
 * ```ts
 * const ok = await outcome<number>(async (x: number) => x * 2, 5);
 * console.log(ok); // { status: 'fulfilled', value: 10 }
 * ```
 * @example
 * _Rejected outcome:_
 * ```ts
 * const err = await outcome(() => { throw new Error('fail'); });
 * console.log(err); // { reason: Error('fail'), status: 'rejected' }
 * ```
 * @param {ArrayExecutor<T>} executor - Function to execute.
 * @param {Parameters<ArrayExecutor<T>>} args - Arguments passed to the executor.
 * @returns {Promise<Settled<T>>} A settled outcome object.
 * @template T - The element type of the array.
 */
export async function outcome<T>(
  executor: ArrayExecutor<T>,
  ...args: Parameters<ArrayExecutor<T>>
): Promise<Settled<T>> {
  try {
    const value = await executor(...args);
    return { status: 'fulfilled', value };
  } catch (reason) {
    return { reason, status: 'rejected' };
  }
}
