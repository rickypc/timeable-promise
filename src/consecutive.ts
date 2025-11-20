/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Run executor sequentially across array items or groups with optional chunk control.
 * @file consecutive.ts
 * @license AGPL-3.0-or-later
 */

import { type ArrayExecutor, outcome, type Settled } from './outcome';
import { toNumber } from './toNumber';

/**
 * Runs the executor sequentially across items in a single array.
 * If a concurrency value is provided, items are grouped into chunks of that size
 * and each group is processed one after another. While the output is always a
 * settled results array, the input shape differs: either individual items or
 * grouped chunks.
 * @example With concurrency (groups of size 2)
 * const consecutiveSettled1 = await consecutive([1, 2, 3, 4, 5], async (group) => {
 *   return group.map(x => x * 2);
 * }, 2);
 * console.log(consecutiveSettled1);
 * // [
 * //   { status: 'fulfilled', value: [2, 4] },
 * //   { status: 'fulfilled', value: [6, 8] },
 * //   { status: 'fulfilled', value: [10] }
 * // ]
 * @example Without concurrency (each item processed one by one)
 * const consecutiveSettled2 = await consecutive([1, 2, 3], async (value) => {
 *   return value * 2;
 * });
 * console.log(consecutiveSettled2);
 * // [
 * //   { status: 'fulfilled', value: 2 },
 * //   { status: 'fulfilled', value: 4 },
 * //   { status: 'fulfilled', value: 6 }
 * // ]
 * @param {T[]} array - The array items to be processed by executor.
 * @param {ArrayExecutor<T>} executor - Executor function applied to each
 *   item or group.
 * @param {number} concurrency - The maximum group size (default = 0).
 * @returns {Promise<Settled<T>[]>} A promise resolving to an array of
 *   settled results.
 * @template T - The element type of the array.
 */
// eslint-disable-next-line import/prefer-default-export
export function consecutive<T>(
  array: T[],
  executor: ArrayExecutor<T>,
  concurrency: number = 0,
): Promise<Settled<T>[]> {
  if (toNumber(concurrency)) {
    return array.reduce(async (previous, _, index) => {
      const accumulator = await previous;
      if (index % concurrency === 0) {
        accumulator[accumulator.length] = await outcome(
          executor,
          array.slice(index, index + concurrency) as T,
          index,
          array,
          accumulator,
        );
      }
      return accumulator;
    }, Promise.resolve([] as Settled<T>[]));
  }
  return array.reduce(async (previous, value, index) => {
    const accumulator = await previous;
    accumulator[accumulator.length] = await outcome(
      executor,
      value,
      index,
      array,
      accumulator,
    );
    return accumulator;
  }, Promise.resolve([] as Settled<T>[]));
}
