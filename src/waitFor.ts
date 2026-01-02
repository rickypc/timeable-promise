/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description Wait until a predicate returns true or timeout occurs.
 * @file waitFor.ts
 * @license AGPL-3.0-or-later
 */

import untilSettledOrTimedOut from './untilSettledOrTimedOut';

/**
 * Wait until a predicate returns true or timeout occurs.
 * @example
 * _Wait for predicate to become true:_
 * ```ts
 * let inflight = true;
 * const predicate = () => !inflight;
 * const timeout = 5000;
 *
 * setTimeout(() => {
 *   inflight = false; // long process done
 * }, 1000);
 *
 * console.time('waitFor');
 * await waitFor(predicate, timeout, 200);
 * console.timeEnd('waitFor');
 * ```
 * @param {() => boolean} predicate - Function returning a boolean, checked
 *   repeatedly.
 * @param {number} timeout - Max time to wait in ms.
 * @param {number} interval - Polling interval in ms (default = 1000).
 * @returns {Promise<void>} A promise that resolves when predicate is true or
 *   timeout expires.
 */
export default function waitFor(
  predicate: () => boolean,
  timeout: number,
  interval: number = 1000,
): Promise<void> {
  let timer: number | ReturnType<typeof setInterval> | null = null;
  return untilSettledOrTimedOut<void>(
    (resolve, _, pending) => {
      timer = setInterval(() => {
        if (predicate()) {
          clearInterval(timer!);
          timer = null;
          // istanbul ignore else
          if (pending()) {
            resolve();
          }
        }
      }, interval);
    },
    (resolve) => {
      clearInterval(timer as number);
      timer = null;
      resolve();
    },
    timeout,
  );
}
