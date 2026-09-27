/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description Resilient test runner.
 * @file runner.ts
 * @license AGPL-3.0-or-later
 */

import { gcAndSweep, heapStats } from 'bun:jsc';
import { Bench } from 'tinybench';

export type ResilientOptions = {
  leak?: number;
  minSamples?: number;
  perf?: number;
  repeatSuite?: number;
  testName?: string;
};

/**
 * Calculates the total estimated bytes of active user-land data structures.
 * @returns {number} The user-land total heap bytes.
 */
function userlandHeapBytes(): number {
  const engineTypes = [
    'AsyncFunction',
    'AsyncGeneratorFunction',
    'Callee',
    'CustomGetterSetter',
    'DOMAttributeGetterSetter',
    'Function',
    'FunctionCodeBlock',
    'FunctionExecutable',
    'GeneratorFunction',
    'GetterSetter',
    'HashMapBucket',
    'Immutable Butterfly',
    'JSGlobalLexicalEnvironment',
    'JSLexicalEnvironment',
    'JSModuleEnvironment',
    'JSPropertyNameEnumerator',
    'JSSourceCode',
    'ModuleProgramCodeBlock',
    'ModuleProgramExecutable',
    'NativeExecutable',
    'PropertyTable',
    'Structure',
    'StructureChain',
    'StructureRareData',
    'SymbolTable',
    'UnlinkedFunctionCodeBlock',
    'UnlinkedFunctionExecutable',
    'UnlinkedModuleProgramCodeBlock',
  ];
  const { objectTypeCounts } = heapStats();
  let response = 0;
  for (const [type, count] of Object.entries(objectTypeCounts)) {
    if (engineTypes.includes(type)) {
      continue;
    }
    if (['Boolean', 'Number', 'string', 'symbol'].includes(type)) {
      response += count * 32;
    } else if (['HashMapBucket', 'SparseArrayValueMap'].includes(type)) {
      response += count * 128;
    } else if (type === 'CallbackObject') {
      response += count * 8;
    } else {
      response += count * 64;
    }
  }
  return response;
}

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
  const begin = performance.now();
  const delay = 25;
  const errors: { ex: unknown; src: number | string }[] = [];
  const onWarning = (ex: Error): void => {
    if (ex?.name === 'MaxListenersExceededWarning') {
      errors.push({ ex, src: 'warn' });
    }
  };
  const runner = async (): Promise<void> => {
    const runSample = async (i: number): Promise<void> => {
      if (i >= minSamples) {
        return;
      }
      try {
        await fn();
      } catch (ex) {
        errors.push({ ex, src: i });
      }
      await Bun.sleep(delay);
      await runSample(i + 1);
    };
    await runSample(0);
  };
  gcAndSweep();
  const before = userlandHeapBytes();
  try {
    process.on('warning', onWarning);
    await Promise.all(Array.from({ length: repeatSuite }, () => runner()));
  } catch (ex) {
    errors.push({ ex, src: 'concurrent' });
  } finally {
    process.removeListener('warning', onWarning);
  }
  await Bun.sleep(delay);
  gcAndSweep();
  const after = userlandHeapBytes();
  if (errors.length) {
    console.error(`--- ${testName}: Runner Errors ---`);
    errors.forEach((error) => {
      console.error(error);
    });
    return false;
  }
  const growth = Math.max(0, after - before);
  const response = growth < threshold;
  if (!response || verbose) {
    const duration = performance.now() - begin;
    console.info(
      `${testName}: Growth=${growth} | Threshold=${threshold} | Duration=${duration.toFixed(
        2,
      )}ms | ${response ? 'RESILIENT ✅' : 'LEAK ❌'}`,
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
  const begin = performance.now();
  const bench = new Bench({
    concurrency: 'task',
    // Iterations.
    iterations: minSamples,
    // Concurrency.
    threshold: repeatSuite,
    timestampProvider: 'bunNanoseconds',
    warmup: false,
  });
  bench.add(testName, fn);
  await bench.run();
  const { result } = (bench.getTask(testName) as any) ?? {};
  const totalTime = result?.state === 'completed' ? result.latency.mean / 1e3 : threshold + 1;
  const response = totalTime < threshold;
  if (!response || verbose) {
    const duration = performance.now() - begin;
    console.info(
      `${testName}: Total=${totalTime} | Threshold=${threshold} | Duration=${duration.toFixed(
        2,
      )}ms | ${response ? 'FAST ✅' : 'SLOW ❌'}`,
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
    // 75000ns.
    perf = 0.0075,
    // Concurrency.
    repeatSuite = 200,
    testName = 'should be resilient',
  }: ResilientOptions = {},
): Promise<boolean> {
  const type = process.env.RESILIENT_TYPE;
  const verbose = process.argv.includes('--verbose');
  if (type === 'leak') {
    return runLeak(fn, minSamples, repeatSuite, testName, leak, verbose);
  }
  if (type === 'perf') {
    return runPerf(fn, minSamples, repeatSuite, testName, perf, verbose);
  }
  throw new Error(`Unknown RESILIENT_TYPE: ${type}. Valid options: 'leak' | 'perf'`);
}
