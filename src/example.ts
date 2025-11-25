/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Runkit examples.
 * @file example.ts
 * @license AGPL-3.0-or-later
 */

const {
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
} = require('timeable-promise');

module.exports.examples = async (): Promise<string> => {
  let flat: string[] | null = ['a', 'b', 'c'];
  let nested: string[][] | null = [['a', 'b'], ['c']];

  // eslint-disable-next-line no-console
  console.log('1. Chunk ->', chunk([1, 2, 3, 4], 2));

  await concurrent(flat, async (value: number) => value);
  // eslint-disable-next-line no-console
  console.log('2. Concurrent -> ran', flat.join(', '), 'at once -> all fulfilled');

  await concurrents(nested, async (value: number) => value);
  // eslint-disable-next-line no-console
  console.log('3. Concurrents -> ran groups', nested.map((g) => `[${g.join(', ')}]`).join(' + '), 'at once -> all fulfilled');

  await consecutive(flat, async (value: number) => value);
  // eslint-disable-next-line no-console
  console.log('4. Consecutive -> ran', flat.join(' -> '), 'one by one -> all fulfilled');

  await consecutives(nested, async (value: number) => value);
  // eslint-disable-next-line no-console
  console.log('5. Consecutives -> ran groups', nested.map((g) => `[${g.join(', ')}]`).join(' -> '), 'one group at a time -> all fulfilled');

  await parallel(flat, async (value: number) => value);
  // eslint-disable-next-line no-console
  console.log('6. Parallel -> ran', flat.join(', '), 'in parallel -> all fulfilled');

  let timer = poll(() => {}, 1);
  setTimeout(() => {
    timer.stop();
    // Cleanups.
    timer = null;
  }, 3);
  // eslint-disable-next-line no-console
  console.log('7. Poll -> ticked repeatedly until stopped');

  await sequential(flat, async (value: number) => value);
  // eslint-disable-next-line no-console
  console.log('8. Sequential -> ran', flat.join(' -> '), 'in series -> all fulfilled');

  // Cleanups.
  flat = null;
  nested = null;

  await sleep(1);
  // eslint-disable-next-line no-console
  console.log('9. Sleep -> paused ~1ms');

  // eslint-disable-next-line no-console
  console.log('10. ToNumber -> "1" ->', toNumber('1'));

  let settled = await untilSettledOrTimedOut(
    // eslint-disable-next-line no-unused-vars
    async (resolve: (_: boolean) => void, _: unknown, pending: () => boolean) => {
      const value = true;
      // istanbul ignore else
      if (pending()) {
        resolve(value);
      }
    },
    // istanbul ignore next
    // eslint-disable-next-line no-unused-vars
    (_: unknown, reject: (_: Error) => void) => reject(Error('timeout')),
    1,
  ).catch(/* istanbul ignore next */() => false);
  // eslint-disable-next-line no-console
  console.log('11. Settle -> finished before timeout -> return', settled);
  // Cleanups.
  settled = null;

  let timedOut = await untilSettledOrTimedOut(
    // eslint-disable-next-line no-unused-vars
    async (resolve: (_: boolean) => void, _: unknown, pending: () => boolean) => {
      const value = await new Promise<boolean>((done) => {
        setTimeout(done, 3, true);
      });
      // istanbul ignore if
      if (pending()) {
        resolve(value);
      }
    },
    // eslint-disable-next-line no-unused-vars
    (_: unknown, reject: (_: Error) => void) => reject(Error('timeout')),
    2,
  ).catch(() => false);
  // eslint-disable-next-line no-console
  console.log('12. Timeout -> took too long -> rejected -> return', timedOut);
  // Cleanups.
  timedOut = null;

  let inflight: boolean | null = true;
  setTimeout(() => { inflight = false; }, 1);
  await waitFor(() => !inflight, 3, 2);
  // eslint-disable-next-line no-console
  console.log('13. WaitFor -> waited ~3ms until condition met');
  // Cleanups.
  inflight = null;

  return 'Timeable Promise Examples';
};

// Auto-run only when executed directly.
// istanbul ignore if
if (require.main === module) {
  module.exports.examples();
}
