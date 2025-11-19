/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Run array executors concurrently with optional chunk control.
 * @file concurrent.ts
 * @license AGPL-3.0-or-later
 */

import { type ArrayExecutor, type Settled } from './outcome';
import { chunk } from './chunk';

/**
 * Runs the executor concurrently across items in a single array.
 * If a concurrency value is provided, items are grouped into chunks of
 * that size and each chunk is processed in parallel. The output is always
 * a settled results array, but the input shape differs: either individual
 * items or grouped chunks.
 * @example
 * // concurrent -> one concurrent run of items or groups
 *
 * // With concurrency (groups of size 2)
 * const concurrentSettled1 = await concurrent([1, 2, 3, 4, 5], async (chunk) => {
 *   return chunk.map(x => x * 2);
 * }, 2);
 * console.log(concurrentSettled1);
 * // [
 * //   { status: 'fulfilled', value: [2, 4] },
 * //   { status: 'fulfilled', value: [6, 8] },
 * //   { status: 'fulfilled', value: [10] }
 * // ]
 *
 * // Without concurrency (each item processed as its own chunk)
 * const concurrentSettled2 = await concurrent([1, 2, 3], async (value) => {
 *   return value * 2;
 * });
 * console.log(concurrentSettled2);
 * // [
 * //   { status: 'fulfilled', value: 2 },
 * //   { status: 'fulfilled', value: 4 },
 * //   { status: 'fulfilled', value: 6 }
 * // ]
 * @param {T[]} array - The array items to be processed by executor.
 * @param {ArrayExecutor<T>} executor - Executor function applied to each chunk.
 * @param {number} concurrency - The maximum concurrent execution size
 *   (default = 0).
 * @returns {Promise<Settled<T>[]>} A promise resolving to an array of
 *   settled results.
 * @template T - The element type of the array.
 */
// eslint-disable-next-line import/prefer-default-export
export function concurrent<T>(
  array: T[],
  executor: ArrayExecutor<T>,
  concurrency: number = 0,
): Promise<Settled<T>[]> {
  return Promise.allSettled(chunk(array, concurrency).map(executor as ArrayExecutor<any>));
}
