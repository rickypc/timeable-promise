/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Splits the array into groups of size.
 * @file chunk.ts
 * @license AGPL-3.0-or-later
 */

/**
 * Splits an array into chunks of a given size.
 * The final chunk will contain the remaining elements.
 * @example
 * ```ts
 * const chunked = chunk([1, 2, 3, 4, 5], 2);
 * console.log(chunked); // [[1, 2], [3, 4], [5]]
 * ```
 * @param {T[]} array - The original array.
 * @param {number} size - The group size (default = 0).
 * @returns {T[] | T[][]} A new array containing chunked subarrays,
 *   or the original array if size is 0.
 * @template T - The element type of the array.
 */
// eslint-disable-next-line import/prefer-default-export
export function chunk<T>(array: T[], size: number = 0): T[] | T[][] {
  if (size > 0) {
    const length = array.length || 0;
    const response: T[][] = new Array(Math.ceil(length / size));
    for (let i = 0; i < length; i += size) {
      response[Math.floor(i / size)] = array.slice(i, i + size);
    }
    return response;
  }
  return array;
}
