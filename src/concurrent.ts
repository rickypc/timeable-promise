/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description Run array executors concurrently with optional chunk control.
 * @file concurrent.ts
 * @license AGPL-3.0-or-later
 */

import chunk from './chunk';
import { type ItemExecutor, type Settled } from './outcome';

/**
 * Runs the executor concurrently across items in a single array.
 * If a concurrency value is provided, items are grouped into chunks of
 * that size and each chunk is processed in parallel. The output is always
 * a settled results array, but the input shape differs: either individual
 * items or grouped chunks.
 * @example
 * _With concurrency (groups of size 2):_
 * ```ts
 * const concurrentSettled1 = await concurrent<number>([1, 2, 3, 4, 5], async (chunk) => {
 *   return chunk.map(x => x * 2);
 * }, 2);
 * console.log(concurrentSettled1);
 * // [
 * //   { status: 'fulfilled', value: [2, 4] },
 * //   { status: 'fulfilled', value: [6, 8] },
 * //   { status: 'fulfilled', value: [10] }
 * // ]
 * ```
 * @example
 * _Without concurrency (each item processed individually):_
 * ```ts
 * const concurrentSettled2 = await concurrent<number>([1, 2, 3], async (value) => {
 *   return value * 2;
 * });
 * console.log(concurrentSettled2);
 * // [
 * //   { status: 'fulfilled', value: 2 },
 * //   { status: 'fulfilled', value: 4 },
 * //   { status: 'fulfilled', value: 6 }
 * // ]
 * ```
 * @param {T[]} array - The array items to be processed by executor.
 * @param {ItemExecutor<T, U>} executor - Executor function applied to each chunk.
 * @param {number} concurrency - The maximum concurrent execution size
 *   (default = 0).
 * @returns {Promise<Settled<U>[]>} A promise resolving to an array of
 *   settled results.
 * @template T - The item type of the array.
 * @template U - The result type returned by the executor.
 */
export default function concurrent<T, U = T>(
  array: T[],
  executor: ItemExecutor<T, U>,
  concurrency: number = 0,
): Promise<Settled<U>[]> {
  return Promise.allSettled(chunk(array, concurrency).map(executor as any));
}
