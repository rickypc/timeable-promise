/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Provide parallel execution across array items with optional chunked concurrency.
 * @file parallel.ts
 * @license AGPL-3.0-or-later
 */

import chunk from './chunk';
import concurrent from './concurrent';
import concurrents from './concurrents';
import { type ItemExecutor, type Settled } from './outcome';
import toNumber from './toNumber';

/**
 * Provides parallel execution of an executor across array items.
 * If a concurrency value is provided, items are grouped into chunks of that size
 * and processed concurrently via `concurrents`. Otherwise, the entire array is
 * processed concurrently via `concurrent`.
 * @example
 * _With concurrency (groups of size 2):_
 * ```ts
 * const parallelSettled1 = await parallel<number>([1, 2, 3, 4, 5], async (group) => {
 *   return group.map(x => x * 2);
 * }, 2);
 * console.log(parallelSettled1);
 * // [
 * //   { status: 'fulfilled', value: [2, 4] },
 * //   { status: 'fulfilled', value: [6, 8] },
 * //   { status: 'fulfilled', value: [10] }
 * // ]
 * ```
 * @example
 * _Without concurrency (all items processed concurrently):_
 * ```ts
 * const parallelSettled2 = await parallel<number>([1, 2, 3], async (value) => {
 *   return value * 2;
 * });
 * console.log(parallelSettled2);
 * // [
 * //   { status: 'fulfilled', value: 2 },
 * //   { status: 'fulfilled', value: 4 },
 * //   { status: 'fulfilled', value: 6 }
 * // ]
 * ```
 * @param {T[]} array - The array that is being processed in parallel.
 * @param {ItemExecutor<T, U>} executor - Executor function applied to each item
 *   or group.
 * @param {number} concurrency - The maximum group size (default = 0).
 * @returns {Promise<Settled<U>[]>} A promise resolving to an array of settled
 *   results.
 * @template T - The item type of the array.
 * @template U - The result type returned by the executor.
 */
export default function parallel<T, U = T>(
  array: T[],
  executor: ItemExecutor<T, U>,
  concurrency: number = 0,
): Promise<Settled<U>[]> {
  if (toNumber(concurrency)) {
    return concurrents(chunk(array, concurrency), executor, concurrency);
  }
  return concurrent(array, executor);
}
