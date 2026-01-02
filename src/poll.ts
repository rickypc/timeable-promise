/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description Provide polling support without congestion when executor takes longer than interval.
 * @file poll.ts
 * @license AGPL-3.0-or-later
 */

// eslint-disable-next-line no-unused-vars
export type PollExecutor = (stopped: () => boolean) => Promise<void> | void;

export type PollHandle = {
  stop: () => void;
};

/**
 * Provides polling support without congestion when the executor takes longer
 * than the interval. The executor receives a `stopped` function to check
 * if polling has been stopped.
 * @example
 * _Basic polling with stop control:_
 * ```ts
 * const timer = poll((stopped) => {
 *   // Do something promising here...
 *   if (!stopped()) {
 *     // Do something when polling is not stopped...
 *   }
 * }, 100);
 *
 * setTimeout(() => {
 *   // Simulate the end of polling.
 *   timer.stop();
 * }, 1000);
 * ```
 * @param {PollExecutor} executor - Function invoked on each poll.
 *   Receives a `stopped` function.
 * @param {number} interval - Delay interval in milliseconds (default = 1000).
 * @param {boolean} immediately - Whether to run executor immediately at
 *   the beginning (default = false).
 * @returns {PollHandle} An object with a `stop` function to end polling.
 */
export default function poll(
  executor: PollExecutor,
  // istanbul ignore next
  interval: number = 1000,
  immediately: boolean = false,
): PollHandle {
  let inflight = false;
  let timer: number | ReturnType<typeof setInterval> | null;
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
    stop() {
      clearInterval(timer as number);
      timer = null;
    },
  };
}
