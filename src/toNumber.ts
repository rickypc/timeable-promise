/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Convert a value to number, fallback to default if invalid.
 * @file toNumber.ts
 * @license AGPL-3.0-or-later
 */

/**
 * Converts a value to a number. If conversion fails, returns the default value.
 * @example Convert string to number
 * console.log(toNumber('42'));        // 42
 * @example Fallback value when conversion fails
 * console.log(toNumber('abc', 10));   // 10
 * @example Null input defaults to 0
 * console.log(toNumber(null));        // 0
 * @param {unknown} value - The value to convert.
 * @param {number} defaultValue - The fallback if conversion is invalid
 *   (default = 0).
 * @returns {number} A numeric value.
 */
// eslint-disable-next-line import/prefer-default-export
export function toNumber(value: unknown, defaultValue: number = 0): number {
  return 1 / (value as any) ? +value! : defaultValue;
}
