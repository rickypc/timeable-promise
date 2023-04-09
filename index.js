/*!
 *  index.js - a Promise object of an asynchronous operation with timeout support.
 *  Copyright (c) 2018 - 2023 Richard Huang <rickypc@users.noreply.github.com>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Executor function that is executed immediately by the Promise implementation.
 *
 * @param {Function} resolve - Resolve the promise.
 * @param {Function} reject - Reject the promise.
 * @param {Function} pending - True if Promise is not timed out, otherwise false.
 * @typedef {Function} Executor
 * @example
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
 */

/**
 * Timeout executor function that is executed when timeout is reached.
 *
 * @param {Function} resolve - Resolve the promise.
 * @param {Function} reject - Reject the promise.
 * @typedef {Function} TimeoutExecutor
 * @example
 * const timeoutExecutor = (resolve, reject) => {
 *   try {
 *     resolve(true);
 *   } catch (ex) {
 *     reject(false);
 *   }
 * };
 */

/**
 * Provide timeout support on Promise object.
 *
 * @function module:timeable-promise.untilSettledOrTimedOut
 * @param {Executor} executor - Executor function.
 * @param {TimeoutExecutor} timeoutExecutor - Timeout executor function.
 * @param {number} timeout - Timeout.
 * @returns {Promise<*>} Resolve or reject response value.
 * @example
 * const { untilSettledOrTimedOut } = require('timeable-promise');
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
 * const timeoutExecutor = (resolve, reject) => {
 *   try {
 *     resolve(true);
 *   } catch (ex) {
 *     reject(false);
 *   }
 * };
 * const timeout = 5000;
 * const response = await untilSettledOrTimedOut(executor, timeoutExecutor, timeout)
 *   .catch(ex => console.log('nay :(', ex));
 * console.log(`resolved with ${response}, yay!`);
 */
const untilSettledOrTimedOut = (executor, timeoutExecutor, timeout) => {
  let timedout = false;
  let timer = null;

  return new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      timedout = true;
      timer = null;
      timeoutExecutor(resolve, reject);
    }, timeout);
    executor(resolve, reject, () => !timedout);
  }).finally(() => {
    if (!timedout) {
      clearTimeout(timer);
    }
    timer = null;
  });
};

/**
 * Provide waiting support on given predicate.
 *
 * @function module:timeable-promise.waitFor
 * @param {Function} predicate - Predicate function.
 * @param {number} timeout - Timeout.
 * @param {number} [interval=1000] - Check interval.
 * @returns {Promise<void>}
 * @example
 * const { waitFor } = require('timeable-promise');
 * // Long process running...
 * let inflight = true
 * const predicate = () => !inflight;
 * const timeout = 5000;
 * setTimeout(() => {
 *   // Long process done.
 *   inflight = false;
 * }, 1000);
 * console.time('waitFor');
 * await waitFor(predicate, timeout);
 * console.timeEnd('waitFor');
 */
const waitFor = (predicate, timeout, interval = 1000) => {
  let timer = null;
  return untilSettledOrTimedOut(
    (resolve, _, pending) => {
      timer = setInterval(() => {
        if (predicate()) {
          clearInterval(timer);
          timer = null;
          /* istanbul ignore else */
          if (pending()) {
            resolve();
          }
        }
      }, interval);
    },
    (resolve) => {
      clearInterval(timer);
      timer = null;
      resolve();
    },
    timeout,
  );
};

/**
 * A Promise object of an asynchronous operation with timeout support.
 *
 * @module timeable-promise
 * @see {@link https://mzl.la/2MQJhPC|Promise}
 * @example
 * const { untilSettledOrTimedOut, waitFor } = require('timeable-promise');
 * // ---------- untilSettledOrTimedOut ----------
 * const response = await untilSettledOrTimedOut((resolve, reject, pending) => {
 *   // Promise executor with extra `pending` param to check if promise is not
 *   // timed-out yet.
 *   if (pending()) {
 *     resolve(true);
 *   }
 * }, (resolve, reject) => {
 *   // Timeout executor with option to either resolve or reject the promise.
 *   reject(Error('error'));
 * }, 5000)
 *   .catch(ex => console.log('nay :(', ex));
 * console.log(`resolved with ${response}, yay!`);
 * // ---------- waitFor ----------
 * // Long process running...
 * let inflight = true
 * const predicate = () => !inflight;
 * const timeout = 5000;
 * setTimeout(() => {
 *   // Long process done.
 *   inflight = false;
 * }, 1000);
 * console.time('waitFor');
 * await waitFor(predicate, timeout);
 * console.timeEnd('waitFor');
 */
const TimeablePromise = {
  untilSettledOrTimedOut,
  waitFor,
};

module.exports = TimeablePromise;
