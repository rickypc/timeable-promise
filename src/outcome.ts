/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description Wraps executor result into a settled outcome object.
 * @file outcome.ts
 * @license AGPL-3.0-or-later
 */

export type ItemExecutor<T, U = T> = (
  // eslint-disable-next-line no-unused-vars
  value: T[],
  // eslint-disable-next-line no-unused-vars
  index: number,
  // eslint-disable-next-line no-unused-vars
  array: T[][],
  // eslint-disable-next-line no-unused-vars
  accumulator?: PromiseSettledResult<U>[]
) => Promise<U> | U;

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
 * @param {ItemExecutor<T, U>} executor - Function to execute.
 * @param {Parameters<ItemExecutor<T, U>>} args - Arguments passed to
 *   the executor.
 * @returns {Promise<Settled<U>>} A settled outcome object.
 * @template T - The item type of the array.
 * @template U - The result type returned by the executor.
 */
export default async function outcome<T, U = T>(
  executor: ItemExecutor<T, U>,
  ...args: Parameters<ItemExecutor<T, U>>
): Promise<Settled<U>> {
  try {
    const value = await executor(...args);
    return { status: 'fulfilled', value };
  } catch (reason) {
    return { reason, status: 'rejected' };
  }
}
