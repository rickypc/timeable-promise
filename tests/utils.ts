/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Test utilities.
 * @file utils.ts
 * @license AGPL-3.0-or-later
 */

/**
 * Converts a high-resolution time tuple from `process.hrtime()` into
 * milliseconds.
 * @example
 * _Convert to ms:_
 * ```ts
 * const start = process.hrtime();
 * // ... some operation ...
 * const elapsedMs = hrtimeToMs(process.hrtime(start));
 * console.log(`Elapsed: ${elapsedMs}ms`);
 * ```
 * @param {[number, number]} hrtime - A tuple `[seconds, nanoseconds]`
 *   returned by `process.hrtime()`.
 * @returns {number} The total elapsed time in milliseconds.
 */
// eslint-disable-next-line import/prefer-default-export
export function hrtimeToMs(hrtime: [number, number]): number {
  return (hrtime[0] * 1000000000 + hrtime[1]) / 1000000;
}
