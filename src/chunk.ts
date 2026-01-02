/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description Splits the array into groups of size.
 * @file chunk.ts
 * @license AGPL-3.0-or-later
 */

/**
 * Splits an array into chunks of a given size.
 * The final chunk will contain the remaining elements.
 * @example
 * _Chunk into pairs:_
 * ```ts
 * const chunked = chunk<number>([1, 2, 3, 4, 5], 2);
 * console.log(chunked); // [[1, 2], [3, 4], [5]]
 * ```
 * @param {T[]} array - The original array.
 * @param {number} size - The chunk size (default = 0).
 * @returns {U} A new array containing chunked subarrays,
 *   or the original array if size is 0.
 * @template T - The item type of the array.
 * @template U - The result type, which can be either:
 * - `T[]` when no chunking is applied (size is 0 or omitted).
 * - `T[][]` when chunking is applied (size > 0).
 */
export default function chunk<T, U extends T[] | T[][] = T[]>(array: T[], size: number = 0): U {
  if (size > 0) {
    const length = array.length || 0;
    const response: T[][] = new Array(Math.ceil(length / size));
    for (let i = 0; i < length; i += size) {
      response[Math.floor(i / size)] = array.slice(i, i + size);
    }
    return response as U;
  }
  return array as U;
}
