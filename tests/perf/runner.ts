/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Performance test runner.
 * @file runner.ts
 * @license AGPL-3.0-or-later
 */

import Benchmark from 'benchmark';

export type Deferred = {
  // eslint-disable-next-line no-unused-vars
  resolve: (value?: unknown) => void;
};

Benchmark.options.maxTime = 0;
Benchmark.options.minSamples = 5;

/**
 * Executes a named benchmark function and reports its result.
 *
 * This function wraps a benchmark run in a Promise, allowing asynchronous
 * or synchronous functions to be measured. The benchmark will print its
 * results to stdout when complete.
 * @param {string} name - The name of the benchmark to display in output.
 * @param {() => Promise<unknown> | unknown} fn - The function to benchmark.
 *   Can be synchronous or asynchronous; if asynchronous, it should return
 *   a Promise.
 * @returns {Promise<void>} A promise that resolves once the benchmark
 *   has completed.
 */
export default function run(
  name: string,
  fn: () => Promise<unknown> | unknown,
): Promise<void> {
  return new Promise((resolve) => {
    new Benchmark(name, {
      defer: true,
      fn: async (deferred: Deferred) => {
        deferred.resolve(await fn());
      },
    })
      .on('complete', (evt: Benchmark.Event) => {
        process.stdout.write(`${evt.target}\n`);
        resolve();
      })
      .on('error', (evt: Benchmark.Event) => {
        throw (evt.target as any).error;
      })
      .run({ async: true });
  });
}
