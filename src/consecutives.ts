/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Run executor sequentially across multiple array groups with optional chunk control.
 * @file consecutives.ts
 * @license AGPL-3.0-or-later
 */

import { append } from './append';
import { type ArrayExecutor, type Settled } from './outcome';
import { consecutive } from './consecutive';
import { toNumber } from './toNumber';

/**
 * Runs the executor sequentially across multiple groups of an array.
 * Internally calls `consecutive` for each group, then appends the results together.
 * This means the output looks similar to `consecutive`, but the orchestration differs:
 * `consecutives` manages multiple consecutive runs, while `consecutive` handles a single run.
 * @example
 * _With concurrency (groups of size 2):_
 * ```ts
 * const consecutivesSettled1 = await consecutives<number>([1, 2, 3, 4, 5], async (group) => {
 *   return group.map(x => x * 2);
 * }, 2);
 * console.log(consecutivesSettled1);
 * // [
 * //   { status: 'fulfilled', value: [2, 4] },
 * //   { status: 'fulfilled', value: [6, 8] },
 * //   { status: 'fulfilled', value: [10] }
 * // ]
 * ```
 * @example
 * _Without concurrency (each item treated as its own group):_
 * ```ts
 * const consecutivesSettled2 = await consecutives<number>([1, 2, 3], async (value) => {
 *   return value * 2;
 * });
 * console.log(consecutivesSettled2);
 * // [
 * //   { status: 'fulfilled', value: 2 },
 * //   { status: 'fulfilled', value: 4 },
 * //   { status: 'fulfilled', value: 6 }
 * // ]
 * ```
 * @param {T[]} array - The array groups to be processed by executor.
 * @param {ArrayExecutor<T>} executor - Executor function applied to each
 *   group or item.
 * @param {number} concurrency - The maximum group size (default = 0).
 * @returns {Promise<Settled<T>[]>} A promise resolving to an array of
 *   settled results.
 * @template T - The element type of the array.
 */
// eslint-disable-next-line import/prefer-default-export
export function consecutives<T>(
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
          await consecutive(array.slice(index, index + concurrency), executor),
        );
      }
      return accumulator;
    }, Promise.resolve([] as Settled<T>[]));
  }
  return array.reduce(
    async (previous, value) => append(
      await previous,
      await consecutive(value as T[], executor),
    ),
    Promise.resolve([] as Settled<T>[]),
  );
}
