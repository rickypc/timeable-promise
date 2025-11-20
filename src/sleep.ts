/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Suspend execution for the given timeout duration.
 * @file sleep.ts
 * @license AGPL-3.0-or-later
 */

/**
 * Suspends execution for the given timeout duration.
 * @example Sleep for 1 second
 * console.time('sleep');
 * await sleep(1000);
 * console.timeEnd('sleep');
 * @param {number} timeout - Timeout in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the given timeout.
 */
// eslint-disable-next-line import/prefer-default-export
export function sleep(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
