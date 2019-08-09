/*!
 *  index.js - a Promise object of an asynchronous operation with timeout support.
 *  Copyright (c) 2018 - 2019 Richard Huang <rickypc@users.noreply.github.com>
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
 * A Promise object of an asynchronous operation with timeout support.
 *
 * @module timeable-promise
 *
 * @see {@link https://mzl.la/2MQJhPC|Promise}
 *
 * @example
 * const { untilSettledOrTimedOut } = require('timeable-promise');
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
 */
const TimeablePromise = {
  /**
   * Executor function that is executed immediately by the Promise implementation.
   *
   * @callback module:timeable-promise~Executor
   * @param {Function} resolve - Resolve the promise.
   * @param {Function} reject - Reject the promise.
   * @param {Function} pending - True if Promise is not timed out, otherwise false.
   *
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
   * @callback module:timeable-promise~TimeoutExecutor
   * @param {Function} resolve - Resolve the promise.
   * @param {Function} reject - Reject the promise.
   *
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
   * @return {Promise<*>} Resolve or reject response value.
   *
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
  untilSettledOrTimedOut (executor, timeoutExecutor, timeout) {
    let timedout = false;
    let timer = null;

    return new Promise((resolve, reject) => {
      timer = setTimeout(() => {
        timedout = true;
        timeoutExecutor(resolve, reject);
      }, timeout);
      executor(resolve, reject, () => !timedout);
    }).finally(() => {
      if (!timedout) {
        clearTimeout(timer);
      }
      timer = null;
    });
  },
};

module.exports = TimeablePromise;
