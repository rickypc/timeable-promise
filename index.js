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
 * @callback module:timeable-promise.poll~executor
 * @description Executor function that is executed immediately by the Promise implementation.
 * @example
 * const executor = (stopped) => {
 *   // Do something promising here...
 *   if (!stopped()) {
 *     // Do something when polling is not stopped...
 *   }
 * };
 * @param {Function} stopped - True if polling is stopped, otherwise false.
 */

/**
 * @callback module:timeable-promise.untilSettledOrTimedOut~executor
 * @description Executor function that is executed immediately by the Promise implementation.
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
 * @param {Function} resolve - Resolve the promise.
 * @param {Function} reject - Reject the promise.
 * @param {Function} pending - True if Promise is not timed out, otherwise false.
 */

/**
 * @callback module:timeable-promise.untilSettledOrTimedOut~timeoutExecutor
 * @description Timeout executor function that is executed when timeout is reached.
 * @example
 * const timeoutExecutor = (resolve, reject) => {
 *   try {
 *     resolve(true);
 *   } catch (ex) {
 *     reject(false);
 *   }
 * };
 * @param {Function} resolve - Resolve the promise.
 * @param {Function} reject - Reject the promise.
 */

/**
 * @description Timer object containing the polling stop function.
 * @property {Function} stop - The polling stop function.
 * @typedef {object} module:timeable-promise.poll~timer
 */

/**
 * @description Provide polling support without congestion when executor takes longer than interval.
 * @example
 * const { poll } = require('timeable-promise');
 * const timer = poll((stopped) => {
 *   // Do something promising here...
 *   if (!stopped()) {
 *     // Do something when polling is not stopped...
 *   }
 * }, 100);
 * setTimeout(() => {
 *   // Simulate the end of polling.
 *   timer.stop();
 * }, 1000);
 * @function module:timeable-promise.poll
 * @param {module:timeable-promise.poll~executor} executor - Executor function.
 * @param {number} [interval=1000] - Delay interval.
 * @param {boolean} [immediately=false] - Run executor immediately in the beginning.
 * @returns {module:timeable-promise.poll~timer} The return object with stop function.
 */
const poll = (executor, interval = 1000, immediately = false) => {
  let inflight = false;
  let timer;
  const wrapper = async () => {
    if (!inflight) {
      inflight = true;
      await executor(() => timer === null);
      inflight = false;
    }
  };
  if (immediately) {
    setTimeout(wrapper, 10);
  }
  timer = setInterval(wrapper, interval);
  return {
    stop () {
      clearInterval(timer);
      timer = null;
    },
  };
};

/**
 * @description Provide sleep support.
 * @example
 * const { sleep } = require('timeable-promise');
 * console.time('sleep');
 * // Sleep for 1s.
 * await sleep(1000);
 * console.timeEnd('sleep');
 * @function module:timeable-promise.sleep
 * @param {number} timeout - Timeout.
 * @returns {Promise<void>}
 */
const sleep = (timeout) => new Promise((resolve) => {
  setTimeout(resolve, timeout);
});

/**
 * @description Provide timeout support on Promise object.
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
 * @function module:timeable-promise.untilSettledOrTimedOut
 * @param {module:timeable-promise.untilSettledOrTimedOut~executor} executor - Executor function.
 * @param {module:timeable-promise.untilSettledOrTimedOut~timeoutExecutor} timeoutExecutor
 *   Timeout executor function.
 * @param {number} timeout - Timeout.
 * @returns {Promise<*>} Resolve or reject response value.
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
 * @description Provide waiting support on given predicate.
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
 * @function module:timeable-promise.waitFor
 * @param {Function} predicate - Predicate function.
 * @param {number} timeout - Timeout.
 * @param {number} [interval=1000] - Check interval.
 * @returns {Promise<void>}
 */
const waitFor = (predicate, timeout, interval = 1000) => {
  let timer = null;
  return untilSettledOrTimedOut(
    (resolve, _, pending) => {
      timer = setInterval(() => {
        if (predicate()) {
          clearInterval(timer);
          timer = null;
          // istanbul ignore else
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
 * @description A Promise object of an asynchronous operation with timeout support.
 * @example
 * const {
 *   poll,
 *   sleep,
 *   untilSettledOrTimedOut,
 *   waitFor,
 * } = require('timeable-promise');
 *
 * // ---------- poll ----------
 * const timer = poll((stopped) => {
 *   // Do something promising here...
 *   if (!stopped()) {
 *     // Do something when polling is not stopped...
 *   }
 * }, 100);
 * setTimeout(() => {
 *   // Simulate the end of polling.
 *   timer.stop();
 * }, 1000);
 *
 * // ---------- sleep ----------
 * console.time('sleep');
 * // Sleep for 1s.
 * await sleep(1000);
 * console.timeEnd('sleep');
 *
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
 *
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
 * @module timeable-promise
 * @see {@link https://mzl.la/2MQJhPC|Promise}
 */
const TimeablePromise = {
  poll,
  sleep,
  untilSettledOrTimedOut,
  waitFor,
};

module.exports = TimeablePromise;
