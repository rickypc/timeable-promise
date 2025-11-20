/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Run executor concurrently across multiple array groups with optional chunk control.
 * @file concurrents.ts
 * @license AGPL-3.0-or-later
 */

import { append } from './append';
import { type ArrayExecutor, type Settled } from './outcome';
import { concurrent } from './concurrent';
import { toNumber } from './toNumber';

/**
 * Runs the executor concurrently across multiple groups of an array.
 * Internally calls `concurrent` for each group, then appends the results
 * together. While the output format looks similar to `concurrent`,
 * the orchestration differs: `concurrents` manages multiple concurrent runs,
 * whereas `concurrent` handles a single run.
 * @example With concurrency (groups of size 2)
 * const concurrentsSettled1 = await concurrents([1, 2, 3, 4, 5], async (group) => {
 *   return group.map(x => x * 2);
 * }, 2);
 * console.log(concurrentsSettled1);
 * // [
 * //   { status: 'fulfilled', value: [2, 4] },
 * //   { status: 'fulfilled', value: [6, 8] },
 * //   { status: 'fulfilled', value: [10] }
 * // ]
 * @example Without concurrency (each item treated as its own group)
 * const concurrentsSettled2 = await concurrents([1, 2, 3], async (value) => {
 *   return value * 2;
 * });
 * console.log(concurrentsSettled2);
 * // [
 * //   { status: 'fulfilled', value: 2 },
 * //   { status: 'fulfilled', value: 4 },
 * //   { status: 'fulfilled', value: 6 }
 * // ]
 * @param {T[]} array - The array groups to be processed by executor.
 * @param {ArrayExecutor<T>} executor - Executor function applied to each
 *   group.
 * @param {number} concurrency - The maximum concurrent group size
 *   (default = 0).
 * @returns {Promise<Settled<T>[]>} A promise resolving to an array of
 *   settled results.
 * @template T - The element type of the array.
 */
// eslint-disable-next-line import/prefer-default-export
export function concurrents<T>(
  array: T[],
  executor: ArrayExecutor<T>,
  concurrency: number = 0,
): Promise<Settled<T>[]> {
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
    }, Promise.resolve([] as Settled<T>[]));
  }
  return array.reduce(
    async (previous, value) => append(
      await previous,
      await concurrent(value as T[], executor),
    ),
    Promise.resolve([] as Settled<T>[]),
  );
}
