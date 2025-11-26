/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Resilient test runner.
 * @file runner.ts
 * @license AGPL-3.0-or-later
 */

import { HeapDiff } from '@airbnb/node-memwatch';
import { hrtimeToMs } from '#root/tests/utils';
import sleep from '#root/src/sleep';
import { Suite } from 'bench-node';

export type ResilientOptions = {
  leak?: number;
  minSamples?: number;
  perf?: number;
  repeatSuite?: number;
};

/**
 * Runs a memory leak detection by repeatedly executing a function and
 * measuring heap growth. It also captures warnings and errors during execution.
 * @param {() => T | Promise<T>} fn - The function to test for leaks.
 *   Can be synchronous or asynchronous.
 * @param {number} minSamples - Minimum number of samples to run per suite.
 * @param {number} repeatSuite - Number of times to repeat the suite
 *   concurrently.
 * @param {string} testName - Name of the test case for reporting.
 * @param {number} threshold - Maximum allowed heap growth.
 * @param {boolean} verbose - Whether to always log results, even if
 *   under threshold.
 * @returns {Promise<boolean>} Resolves to `true` if heap growth is under
 *   threshold, otherwise `false`.
 * @template T - The return type of the function being tested.
 */
async function runLeak<T>(
  fn: () => T | Promise<T>,
  minSamples: number,
  repeatSuite: number,
  testName: string,
  threshold: number,
  verbose: boolean,
): Promise<boolean> {
  const begin = process.hrtime();
  const delay = 25;
  const errors: { ex: unknown; src: number | string }[] = [];
  const onWarning = (ex: Error): void => {
    if (ex?.name === 'MaxListenersExceededWarning') {
      errors.push({ ex, src: 'warn' });
    }
  };
  const runner = async (): Promise<void> => {
    for (let i = 0; i < minSamples; i += 1) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await fn();
      } catch (ex) {
        errors.push({ ex, src: i });
      }
      // eslint-disable-next-line no-await-in-loop
      await sleep(delay);
    }
  };
  const heapDiff = new HeapDiff();
  process.on('warning', onWarning);
  try {
    await Promise.all(new Array(repeatSuite).fill(null).map(() => runner()));
  } catch (ex) {
    errors.push({ ex, src: 'concurrent' });
  } finally {
    process.removeListener('warning', onWarning);
  }
  const diff = heapDiff.end();
  if (errors.length) {
    // eslint-disable-next-line no-console
    console.error(`--- ${testName}: Runner Errors ---`);
    // eslint-disable-next-line no-console
    errors.forEach((error) => console.error(error));
    return false;
  }
  const growth = diff.change.details.reduce((sum, change: any) => sum + change['+'], 0);
  const response = growth < threshold;
  if (!response || verbose) {
    const duration = hrtimeToMs(process.hrtime(begin));
    // eslint-disable-next-line no-console
    console.info(
      `${testName}: Growth=${growth} | Threshold=${threshold} | Duration=${duration}ms | ${response ? 'RESILIENT ✅' : 'LEAK ❌'}`,
    );
  }
  return response;
}

/**
 * Runs a performance benchmark suite for a given function and evaluates
 * whether its total execution time stays below a specified threshold.
 * @param {() => T | Promise<T>} fn - The function to benchmark.
 *   Can be synchronous or asynchronous.
 * @param {number} minSamples - Minimum number of samples to collect in
 *   the benchmark.
 * @param {number} repeatSuite - Number of times to repeat
 *   the benchmark suite.
 * @param {string} testName - Name of the test case for reporting.
 * @param {number} threshold - Maximum allowed total execution time.
 * @param {boolean} verbose - Whether to always log results, even if under
 *   threshold.
 * @returns {Promise<boolean>} Resolves to `true` if performance is under
 *   threshold, otherwise `false`.
 * @template T - The return type of the function being benchmarked.
 */
async function runPerf<T>(
  fn: () => T | Promise<T>,
  minSamples: number,
  repeatSuite: number,
  testName: string,
  threshold: number,
  verbose: boolean,
): Promise<boolean> {
  const begin = process.hrtime();
  let totalTime = threshold + 1;
  await new Suite({
    benchmarkMode: 'time',
    reporter(results) {
      totalTime = results.reduce((sum, result) => sum + (result?.totalTime || 0), 0);
    },
  }).add(testName, { minSamples, repeatSuite }, fn as () => void).run();
  const response = totalTime < threshold;
  if (!response || verbose) {
    const duration = hrtimeToMs(process.hrtime(begin));
    // eslint-disable-next-line no-console
    console.info(
      `${testName}: Total=${totalTime} | Threshold=${threshold} | Duration=${duration}ms | ${response ? 'FAST ✅' : 'SLOW ❌'}`,
    );
  }
  return response;
}

/**
 * Run fn under stress and check its resiliency.
 * Logs stats and returns true if delta < threshold.
 * @param {() => T} fn - The function to execute repeatedly. May be async.
 * @param {ResilientOptions} options - The resilient options.
 * @returns {Promise<boolean>} The resilient status.
 * @template T - The type of the resolved return value.
 */
export default async function run<T>(
  fn: () => T,
  {
    // 2KB.
    leak = 2048,
    // Iterations
    minSamples = 25,
    // 16000ns.
    perf = 0.0016,
    // Concurrency.
    repeatSuite = 200,
  }: ResilientOptions = {},
): Promise<boolean> {
  const testName = expect.getState().currentTestName;
  const type = process.env.RESILIENT_TYPE;
  const verbose = process.argv.includes('--verbose');
  if (type === 'leak') {
    return runLeak(fn, minSamples, repeatSuite, testName as string, leak, verbose);
  }
  if (type === 'perf') {
    return runPerf(fn, minSamples, repeatSuite, testName as string, perf, verbose);
  }
  throw new Error(`Unknown RESILIENT_TYPE: ${type}. Valid options: 'leak' | 'perf'`);
}
