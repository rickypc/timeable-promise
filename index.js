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
 * @callback module:timeable-promise.concurrent~executor
 * @description Executor function that will be executed concurrently.
 * @example
 * const executor = (value, index, array) => {
 *   // Do something promising here...
 * };
 * @param {*} value - The current value being processed in the array.
 * @param {number} index - The index of the current value being processed in the array.
 * @param {Array} array - The array that is being processed concurrently.
 */

/**
 * @description Concurrent outcome object.
 * @property {Error} reason - The exception object.
 * @property {string} status - The outcome status.
 * @property {*} value - The outcome value.
 * @typedef {object} module:timeable-promise.concurrent~settled
 */

/**
 * @callback module:timeable-promise.consecutive~executor
 * @description Executor function that will be executed consecutively.
 * @example
 * const executor = (value, index, array, accumulator) => {
 *   // Do something promising here...
 * };
 * @param {*} value - The current value being processed in the array.
 * @param {number} index - The index of the current value being processed in the array.
 * @param {Array} array - The array that is being processed consecutively.
 * @param {Array} accumulator - The outcome array from previous call to this executor.
 */

/**
 * @description Consecutive outcome object.
 * @property {Error} reason - The exception object.
 * @property {string} status - The outcome status.
 * @property {*} value - The outcome value.
 * @typedef {object} module:timeable-promise.consecutive~settled
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
 * @description Timer object containing the polling stop function.
 * @property {Function} stop - The polling stop function.
 * @typedef {object} module:timeable-promise.poll~timer
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
 * @description Appends `array` items at the end of `accumulator`.
 * @example
 * const { append } = require('timeable-promise');
 * const appended = append([1, 2], [3, 4]);
 * console.log('appended array', appended);
 * @function module:timeable-promise.append
 * @param {Array} accumulator - The accumulator array.
 * @param {Array} array - The array items that will be appended on accumulator.
 * @private
 * @returns {Array} The appended accumulator array.
 */
const append = (accumulator, array) => {
  for (let accLength = accumulator.length, i = 0, { length } = array; i < length; i += 1) {
    accumulator[accLength + i] = array[i];
  }
  return accumulator;
};

// Before chunk assignment - documentation on the bottom.
const toNumber = (value, defaultValue = 0) => (1 / value ? +value : defaultValue);

/**
 * @description Splits the `array` into groups of `size`.
 *              The final chunk would be the remaining elements.
 * @example
 * const { chunk } = require('timeable-promise');
 * const chunked = chunk([1, 2, 3, 4], 2);
 * console.log('chunked: ', chunked);
 * @function module:timeable-promise.chunk
 * @param {Array} array - The original array.
 * @param {number} [size=0] - The group size.
 * @returns {Array} The chunked array.
 */
const chunk = (array, size = 0) => {
  if (toNumber(size)) {
    const length = array.length || 0;
    const response = new Array(Math.ceil(length / size));
    for (let i = 0; i < length; i += size) {
      response[Math.floor(i / size)] = array.slice(i, i + size);
    }
    return response;
  }
  return array;
};

/**
 * @description Run `executor` on all `array` items concurrently.
 * @example
 * const { concurrent } = require('timeable-promise');
 * const concurrentSettled = await concurrent([...], (value, index, array) => {
 *   // Do something promising here...
 *   return value;
 * });
 * console.log('concurrent settled: ', concurrentSettled);
 * @function module:timeable-promise.concurrent
 * @param {Array} array - The array items to be processed by executor.
 * @param {module:timeable-promise.concurrent~executor} executor - Executor function.
 * @param {number} [concurrency=0] - The max concurrent execution.
 * @returns {Promise<Array<module:timeable-promise.concurrent~settled>>}
 *          The concurrent outcome objects.
 */
const concurrent = (array, executor, concurrency = 0) => Promise.allSettled(
  chunk(array, concurrency).map(executor),
);

/**
 * @description Run `executor` on all `array` groups concurrently.
 * @example
 * const { concurrents } = require('timeable-promise');
 * const concurrentsSettled = await concurrents([...], (value, index, array) => {
 *   // Do something promising here...
 *   return value;
 * });
 * console.log('concurrents settled: ', concurrentsSettled);
 * @function module:timeable-promise.concurrents
 * @param {Array} array - The array groups to be processed by executor.
 * @param {module:timeable-promise.concurrent~executor} executor - Executor function.
 * @param {number} [concurrency=0] - The max concurrent execution.
 * @returns {Promise<Array<module:timeable-promise.concurrent~settled>>}
 *          The concurrent outcome objects.
 */
const concurrents = (array, executor, concurrency = 0) => {
  if (toNumber(concurrency)) {
    return array.reduce(async (previous, _, index) => {
      const accumulator = await previous;
      if (index % concurrency === 0) {
        return append(
          accumulator,
          await concurrent(array.slice(index, index + concurrency), executor),
        );
      }
      return accumulator;
    }, Promise.resolve([]));
  }
  return array.reduce(
    async (previous, value) => append(await previous, await concurrent(value, executor)),
    Promise.resolve([]),
  );
};

// Before consecutive assignment - documentation on the bottom.
const outcome = async (executor, ...rest) => {
  let response;
  try {
    response = {
      status: 'fulfilled',
      value: await executor(...rest),
    };
  } catch (ex) {
    response = {
      reason: ex,
      status: 'rejected',
    };
  }
  return response;
};

/**
 * @description Run `executor` on all `array` items consecutively.
 * @example
 * const { consecutive } = require('timeable-promise');
 * const consecutiveSettled = await consecutive([...], (value, index, array) => {
 *   // Do something promising here...
 *   return value;
 * });
 * console.log('consecutive settled: ', consecutiveSettled);
 * @function module:timeable-promise.consecutive
 * @param {Array} array - The array items to be processed by executor.
 * @param {module:timeable-promise.consecutive~executor} executor - Executor function.
 * @param {number} [concurrency=0] - The max consecutive execution.
 * @returns {Promise<Array<module:timeable-promise.consecutive~settled>>}
 *          The consecutive outcome objects.
 */
const consecutive = (array, executor, concurrency = 0) => {
  if (toNumber(concurrency)) {
    return array.reduce(async (previous, _, index) => {
      const accumulator = await previous;
      if (index % concurrency === 0) {
        accumulator[accumulator.length] = await outcome(
          executor,
          array.slice(index, index + concurrency),
          index,
          array,
          accumulator,
        );
      }
      return accumulator;
    }, Promise.resolve([]));
  }
  return array.reduce(async (previous, value, index) => {
    const accumulator = await previous;
    accumulator[accumulator.length] = await outcome(executor, value, index, array, accumulator);
    return accumulator;
  }, Promise.resolve([]));
};

/**
 * @description Run `executor` on all `array` groups consecutively.
 * @example
 * const { consecutives } = require('timeable-promise');
 * const consecutivesSettled = await consecutives([...], (value, index, array) => {
 *   // Do something promising here...
 *   return value;
 * });
 * console.log('consecutives settled: ', consecutivesSettled);
 * @function module:timeable-promise.consecutives
 * @param {Array} array - The array groups to be processed by executor.
 * @param {module:timeable-promise.consecutive~executor} executor - Executor function.
 * @param {number} [concurrency=0] - The max consecutive execution.
 * @returns {Promise<Array<module:timeable-promise.consecutive~settled>>}
 *          The consecutive outcome objects.
 */
const consecutives = (array, executor, concurrency = 0) => {
  if (toNumber(concurrency)) {
    return array.reduce(async (previous, _, index) => {
      const accumulator = await previous;
      if (index % concurrency === 0) {
        return append(
          accumulator,
          await consecutive(array.slice(index, index + concurrency), executor),
        );
      }
      return accumulator;
    }, Promise.resolve([]));
  }
  return array.reduce(
    async (previous, value) => append(await previous, await consecutive(value, executor)),
    Promise.resolve([]),
  );
};

/**
 * @description Returns outcome format.
 * @example
 * const { outcome } = require('timeable-promise');
 * const outcomeObject = await outcome(() => {}, value, index, array);
 * console.log('outcome object: ', outcomeObject);
 * @function module:timeable-promise.outcome
 * @param {module:timeable-promise.consecutive~executor} executor - Executor function.
 * @param  {...any} rest - Executor arguments.
 * @private
 * @returns {module:timeable-promise.consecutive~settled} The consecutive outcome object.
 */

/**
 * @description Provide parallel execution with `concurrency` support.
 * @example
 * const { parallel } = require('timeable-promise');
 * const parallelSettled = await parallel([...], (value, index, array) => {
 *   // Do something promising here...
 *   return value;
 * });
 * console.log('parallel settled: ', parallelSettled);
 * @function module:timeable-promise.parallel
 * @param {Array} array - The array that is being processed in parallel.
 * @param {module:timeable-promise.concurrent~executor} executor - Executor function.
 * @param {number} [concurrency=0] - The max concurrent execution.
 * @returns {Promise<Array<module:timeable-promise.concurrent~settled>>}
 *          The parallel outcome objects.
 */
const parallel = (array, executor, concurrency = 0) => {
  if (toNumber(concurrency)) {
    return concurrents(chunk(array, concurrency), executor, concurrency);
  }
  return concurrent(array, executor);
};

/**
 * @description Provide polling support without congestion when `executor`
 *              takes longer than `interval`.
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
 * @description Provide sequential execution with `concurrency` support.
 * @example
 * const { sequential } = require('timeable-promise');
 * const sequentialSettled = await sequential([...], (value, index, array) => {
 *   // Do something promising here...
 *   return value;
 * });
 * console.log('sequential settled: ', sequentialSettled);
 * @function module:timeable-promise.sequential
 * @param {Array} array - The array that is being processed in sequential.
 * @param {module:timeable-promise.consecutive~executor} executor - Executor function.
 * @param {number} [concurrency=0] - The max consecutive execution.
 * @returns {Promise<Array<module:timeable-promise.consecutive~settled>>}
 *          The sequential outcome objects.
 */
const sequential = (array, executor, concurrency = 0) => {
  if (toNumber(concurrency)) {
    return consecutives(chunk(array, concurrency), executor, concurrency);
  }
  return consecutive(array, executor);
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
 * @description Converts `value` to number.
 * @example
 * const { toNumber } = require('timeable-promise');
 * const converted = toNumber('1');
 * console.log('converted: ', 1);
 * @function module:timeable-promise.toNumber
 * @param {*} value - The value to be converted to number.
 * @param {number} [defaultValue=0] - The default number.
 * @returns {number} The converted number.
 */

/**
 * @description Provide `timeout` support on Promise object.
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
 * @description Provide waiting support on given `predicate`.
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
 * @description Various asynchronous operations with timeout support.
 * @example
 * const {
 *   chunk,
 *   concurrent,
 *   concurrents,
 *   consecutive,
 *   consecutives,
 *   parallel,
 *   poll,
 *   sequential,
 *   sleep,
 *   toNumber,
 *   untilSettledOrTimedOut,
 *   waitFor,
 * } = require('timeable-promise');
 *
 * // ---------- chunk ----------
 * const chunked = chunk([1, 2, 3, 4], 2);
 * console.log('chunked: ', chunked);
 *
 * // ---------- concurrent ----------
 * const concurrentSettled = await concurrent([...], (value, index, array) => {
 *   // Do something promising here...
 *   return value;
 * });
 * console.log('concurrent settled: ', concurrentSettled);
 *
 * // ---------- concurrents ----------
 * const concurrentsSettled = await concurrents([...], (value, index, array) => {
 *   // Do something promising here...
 *   return value;
 * });
 * console.log('concurrents settled: ', concurrentsSettled);
 *
 * // ---------- consecutive ----------
 * const consecutiveSettled = await consecutive([...], (value, index, array) => {
 *   // Do something promising here...
 *   return value;
 * });
 * console.log('consecutive settled: ', consecutiveSettled);
 *
 * // ---------- consecutives ----------
 * const consecutivesSettled = await consecutives([...], (value, index, array) => {
 *   // Do something promising here...
 *   return value;
 * });
 * console.log('consecutives settled: ', consecutivesSettled);
 *
 * // ---------- parallel ----------
 * const parallelSettled = await parallel([...], (value, index, array) => {
 *   // Do something promising here...
 *   return value;
 * });
 * console.log('parallel settled: ', parallelSettled);
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
 * // ---------- sequential ----------
 * const sequentialSettled = await sequential([...], (value, index, array) => {
 *   // Do something promising here...
 *   return value;
 * });
 * console.log('sequential settled: ', sequentialSettled);
 *
 * // ---------- sleep ----------
 * console.time('sleep');
 * // Sleep for 1s.
 * await sleep(1000);
 * console.timeEnd('sleep');
 *
 * // ---------- toNumber ----------
 * const converted = toNumber('1');
 * console.log('converted: ', 1);
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
  chunk,
  concurrent,
  concurrents,
  consecutive,
  consecutives,
  parallel,
  poll,
  sequential,
  sleep,
  toNumber,
  untilSettledOrTimedOut,
  waitFor,
};

module.exports = TimeablePromise;
