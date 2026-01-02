/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description Appends `array` items at the end of `accumulator`.
 * @file append.ts
 * @license AGPL-3.0-or-later
 */

/**
 * Appends items from one array onto the end of another.
 * @example
 * _Basic append:_
 * ```ts
 * const appended = append<number>([1, 2], [3, 4]);
 * console.log(appended); // [1, 2, 3, 4]
 * ```
 * @param {T[]} accumulator - The accumulator array.
 * @param {T[]} array - The array items that will be appended.
 * @returns {T[]} The appended accumulator array.
 * @template T - The element type of the array.
 */
export default function append<T>(accumulator: T[], array: T[]): T[] {
  for (let accLength = accumulator.length, i = 0, { length } = array; i < length; i += 1) {
    // eslint-disable-next-line security/detect-object-injection
    accumulator[accLength + i] = array[i];
  }
  return accumulator;
}
