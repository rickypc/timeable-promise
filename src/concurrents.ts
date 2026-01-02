/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description Run executor concurrently across multiple array groups with optional chunk control.
 * @file concurrents.ts
 * @license AGPL-3.0-or-later
 */

import append from './append';
import concurrent from './concurrent';
import { type ItemExecutor, type Settled } from './outcome';
import toNumber from './toNumber';

/**
 * Runs the executor concurrently across multiple groups of an array.
 * Internally calls `concurrent` for each group, then appends the results
 * together. While the output format looks similar to `concurrent`,
 * the orchestration differs: `concurrents` manages multiple concurrent runs,
 * whereas `concurrent` handles a single run.
 * @example
 * _With concurrency (groups of size 2):_
 * ```ts
 * const concurrentsSettled1 = await concurrents<number>([1, 2, 3, 4, 5], async (group) => {
 *   return group.map(x => x * 2);
 * }, 2);
 * console.log(concurrentsSettled1);
 * // [
 * //   { status: 'fulfilled', value: [2, 4] },
 * //   { status: 'fulfilled', value: [6, 8] },
 * //   { status: 'fulfilled', value: [10] }
 * // ]
 * ```
 * @example
 * _Without concurrency (each item treated as its own group):_
 * ```ts
 * const concurrentsSettled2 = await concurrents<number>([1, 2, 3], async (value) => {
 *   return value * 2;
 * });
 * console.log(concurrentsSettled2);
 * // [
 * //   { status: 'fulfilled', value: 2 },
 * //   { status: 'fulfilled', value: 4 },
 * //   { status: 'fulfilled', value: 6 }
 * // ]
 * ```
 * @param {T[]} array - The array groups to be processed by executor.
 * @param {ItemExecutor<T, U>} executor - Executor function applied to each
 *   group.
 * @param {number} concurrency - The maximum concurrent group size
 *   (default = 0).
 * @returns {Promise<Settled<U>[]>} A promise resolving to an array of
 *   settled results.
 * @template T - The item type of the array.
 * @template U - The result type returned by the executor.
 */
export default function concurrents<T, U = T>(
  array: T[],
  executor: ItemExecutor<T, U>,
  concurrency: number = 0,
): Promise<Settled<U>[]> {
  if (toNumber(concurrency)) {
    return array.reduce(async (previous, _, index) => {
      const accumulator = await previous;
      if (index % concurrency === 0) {
        return append(
          accumulator,
          await concurrent(array.slice(index, index + concurrency), executor),
        );
      }
      return accumulator;
    }, Promise.resolve([] as Settled<U>[]));
  }
  return array.reduce(
    async (previous, value) => append(
      await previous,
      await concurrent(value as T[], executor),
    ),
    Promise.resolve([] as Settled<U>[]),
  );
}
