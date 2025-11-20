/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Leak test runner.
 * @file runner.ts
 * @license AGPL-3.0-or-later
 */

import memwatch from '@airbnb/node-memwatch';
import tape from 'tape';

const concurrency = 200;
const concurrents = [...Array(concurrency).keys()];
const exiter = (): void => process.exit(0);
const iterations = 25;
const log = (t: tape.Test, message: string): void => message.split('\n')
  .forEach((line) => (t as any).emit('result', line));
const max = concurrency * iterations;

process.once('SIGINT', exiter);
process.once('SIGTERM', exiter);

/**
 * Run a leak test using tape and memwatch.
 *
 * This function executes the provided test function concurrently,
 * monitors for event listener leaks and memory leaks, and reports
 * the results via tape assertions.
 * @param {string} name - The name of the test.
 * @param {() => Promise<unknown> | unknown} fn - The function to execute
 *   repeatedly. May be async.
 * @returns {Promise<void>} A promise that resolves once the test has completed.
 */
export default function run(
  name: string,
  fn: () => Promise<unknown> | unknown,
): Promise<void> {
  return new Promise((resolve) => {
    tape(name, async (t) => {
      t.plan(1);
      let error: Error | null = null;
      const catcher = (err: any = {}): void => {
        if (err.name === 'MaxListenersExceededWarning') {
          error = error || err;
        }
      };
      const runner = async (count: number, done: () => void): Promise<void> => {
        if (error || count === iterations) {
          done();
          return;
        }
        await fn();
        // Enough time to take a deep breath.
        setTimeout(() => runner(count + 1, done), 25);
      };

      const heapDiff = new memwatch.HeapDiff();
      process.on('warning', catcher);
      await Promise.all(concurrents
        .map(() => new Promise<void>((done) => { runner(0, done); })));
      process.removeListener('warning', catcher);

      if (error) {
        log(t, (error as any).stack);
        t.fail('event listener leak detected');
        resolve();
        return;
      }

      const diff = heapDiff.end();
      const leaks = diff.change.details.filter((change: any) => change['+'] >= max);

      if (leaks.length) {
        log(t, JSON.stringify(diff, null, 2));
        t.fail('memory leak detected');
      } else {
        t.pass('no memory leak detected');
      }

      resolve();
    });
  });
}
