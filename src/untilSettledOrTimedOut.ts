/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Provide timeout support for Promise execution with fallback executor.
 * @file untilSettledOrTimedOut.ts
 * @license AGPL-3.0-or-later
 */

export type PromiseExecutor<T> = (
  // eslint-disable-next-line no-unused-vars
  resolve: (value: T | PromiseLike<T>) => void,
  // eslint-disable-next-line no-unused-vars
  reject: (reason?: any) => void,
  // eslint-disable-next-line no-unused-vars
  pending: () => boolean
) => void;

export type TimeoutExecutor<T> = (
  // eslint-disable-next-line no-unused-vars
  resolve: (value: T | PromiseLike<T>) => void,
  // eslint-disable-next-line no-unused-vars
  reject: (reason?: any) => void
) => void;

/**
 * Provides timeout support for a Promise. The executor runs until either
 * it settles or the timeout expires, in which case the timeoutExecutor
 * is invoked.
 * @example
 * _Executor with timeout fallback:_
 * ```ts
 * const executor = (resolve, reject, pending) => {
 *   // Do something promising here...
 *   if (pending()) {
 *     try {
 *       // Do something more promising here...
 *       resolve(true);
 *     } catch (ex) {
 *       reject(false);
 *     }
 *   }
 * };
 *
 * const timeoutExecutor = (resolve, reject) => {
 *   try {
 *     resolve(true);
 *   } catch (ex) {
 *     reject(false);
 *   }
 * };
 *
 * const timeout = 5000;
 * const response = await untilSettledOrTimedOut<boolean>(executor, timeoutExecutor, timeout)
 *   .catch(ex => console.log('nay :(', ex));
 * console.log(`resolved with ${response}, yay!`);
 * ```
 * @param {PromiseExecutor<T>} executor - Executor function, receives resolve,
 *   reject, and a `pending` function.
 * @param {TimeoutExecutor<T>} timeoutExecutor - Function invoked if timeout
 *   occurs, receives resolve and reject.
 * @param {number} timeout - Timeout in milliseconds.
 * @returns {Promise<T>} A promise resolving or rejecting with the executor
 *   or timeoutExecutor result.
 * @template T - The type of the resolved return value.
 */
export function untilSettledOrTimedOut<T>(
  executor: PromiseExecutor<T>,
  timeoutExecutor: TimeoutExecutor<T>,
  timeout: number,
): Promise<T> {
  let timedOut = false;
  let timer: number | ReturnType<typeof setTimeout> | null = null;
  return new Promise<T>((resolve, reject) => {
    timer = setTimeout(() => {
      timedOut = true;
      timer = null;
      timeoutExecutor(resolve, reject);
    }, timeout);
    executor(resolve, reject, () => !timedOut);
  }).finally(() => {
    if (!timedOut) {
      clearTimeout(timer as number);
    }
    timer = null;
  });
}
