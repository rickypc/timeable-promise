/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Convert a value to number, fallback to default if invalid.
 * @file toNumber.ts
 * @license AGPL-3.0-or-later
 */

/**
 * Converts a value to a number. If conversion fails, returns the default value.
 * @example
 * _Convert string to number:_
 * ```ts
 * console.log(toNumber('42'));        // 42
 * ```
 * @example
 * _Fallback value when conversion fails:_
 * ```ts
 * console.log(toNumber('abc', 10));   // 10
 * ```
 * @example
 * _Null input defaults to 0:_
 * ```ts
 * console.log(toNumber(null));        // 0
 * ```
 * @param {unknown} value - The value to convert.
 * @param {number} defaultValue - The fallback if conversion is invalid
 *   (default = 0).
 * @returns {number} A numeric value.
 */
export default function toNumber(value: unknown, defaultValue: number = 0): number {
  return 1 / (value as any) ? +value! : defaultValue;
}
