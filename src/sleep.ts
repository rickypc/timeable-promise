/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Suspend execution for the given timeout duration.
 * @file sleep.ts
 * @license AGPL-3.0-or-later
 */

/**
 * Suspends execution for the given timeout duration.
 * @example
 * _Sleep for 1 second:_
 * ```ts
 * console.time('sleep');
 * await sleep(1000);
 * console.timeEnd('sleep');
 * ```
 * @param {number} timeout - Timeout in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the given timeout.
 */
export default function sleep(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
