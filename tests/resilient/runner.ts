/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Resilient test runner.
 * @file runner.ts
 * @license AGPL-3.0-or-later
 */

import { HeapDiff } from '@airbnb/node-memwatch';
import { Suite } from 'bench-node';

export type ResilientOptions = {
  concurrency?: number;
  delay?: number;
  iterations?: number;
  leak?: number;
  perf?: number;
};

/**
 * Converts a high-resolution time tuple from `process.hrtime()` into
 * milliseconds.
 * @example
 * _Convert to ms:_
 * ```ts
 * const start = process.hrtime();
 * // ... some operation ...
 * const elapsedMs = hrtimeToMs(process.hrtime(start));
 * console.log(`Elapsed: ${elapsedMs}ms`);
 * ```
 * @param {[number, number]} hrtime - A tuple `[seconds, nanoseconds]`
 *   returned by `process.hrtime()`.
 * @returns {number} The total elapsed time in milliseconds.
 */
export function hrtimeToMs(hrtime: [number, number]): number {
  return (hrtime[0] * 1000000000 + hrtime[1]) / 1000000;
}

/**
 * Run fn under stress and check memory resiliency.
 * Logs heap stats and returns true if growth < threshold.
 * @param {() => T} fn - The function to execute repeatedly. May be async.
 * @param {ResilientOptions} options - The stress options.
 * @returns {Promise<boolean>} The leak resilient status.
 * @template T - The type of the resolved return value.
 */
export async function run<T>(
  fn: () => T,
  {
    concurrency = 200,
    delay = 25,
    iterations = 25,
    // 2KB.
    leak = 2048,
    // 15000ns.
    perf = 0.0015,
  }: ResilientOptions = {},
): Promise<boolean> {
  const begin = process.hrtime();
  const testName = expect.getState().currentTestName;
  const type = process.env.RESILIENT_TYPE;
  const verbose = process.argv.includes('--verbose');
  if (type === 'leak') {
    const errors: { ex: unknown; src: number | string }[] = [];
    const onWarning = (ex: Error): void => {
      if (ex?.name === 'MaxListenersExceededWarning') {
        errors.push({ ex, src: 'warn' });
      }
    };
    const runner = async (): Promise<void> => {
      for (let i = 0; i < iterations; i += 1) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await fn();
        } catch (ex) {
          errors.push({ ex, src: i });
        }
        if (delay > 0) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => {
            setTimeout(resolve, delay);
          });
        }
      }
    };
    const heapDiff = new HeapDiff();
    process.on('warning', onWarning);
    try {
      await Promise.all(Array.from({ length: concurrency }, () => runner()));
    } catch (ex) {
      errors.push({ ex, src: 'concurrent' });
    } finally {
      process.removeListener('warning', onWarning);
    }
    const diff = heapDiff.end();
    const end = process.hrtime(begin);
    if (errors.length) {
      if (verbose) {
        // eslint-disable-next-line no-console
        console.error(`--- ${testName}: Runner Errors ---`);
        // eslint-disable-next-line no-console
        errors.forEach((error) => console.error(error));
      }
      return false;
    }
    const growth = diff.change.details.reduce((acc, change: any) => acc + change['+'], 0);
    const response = growth < leak;
    if (verbose) {
      // eslint-disable-next-line no-console
      console.info(`${testName}: Growth=${growth} | Threshold=${leak} | Duration=${hrtimeToMs(end)}ms | ${response ? 'RESILIENT ✅' : 'LEAK ❌'}`);
    }
    return response;
  }
  if (type === 'perf') {
    let totalTime = perf + 1;
    await (
      new Suite({
        benchmarkMode: 'time',
        reporter(results) {
          totalTime = 0;
          for (let i = 0, j = results.length; i < j; i += 1) {
            // eslint-disable-next-line security/detect-object-injection
            totalTime += results[i]?.totalTime || 0;
          }
        },
      }).add(testName as string, { minSamples: iterations, repeatSuite: concurrency }, async () => {
        await fn();
      })
    ).run();
    const end = process.hrtime(begin);
    // After end assignment.
    const duration = hrtimeToMs(end);
    const response = totalTime < perf;
    if (verbose) {
      // eslint-disable-next-line no-console
      console.info(`${testName}: Total=${totalTime} | Threshold=${perf} | Duration=${duration}ms | ${response ? 'FAST ✅' : 'SLOW ❌'}\n`);
    }
    return response;
  }
  throw new Error(`Unknown RESILIENT_TYPE: ${type}. Valid options: 'leak' | 'perf'`);
}
