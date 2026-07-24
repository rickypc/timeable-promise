/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
} = require('timeable-promise');

module.exports = async (): Promise<string> => {
  const flat: string[] | null = ['a', 'b', 'c'];
  const nested: string[][] | null = [['a', 'b'], ['c']];

  console.log('1. Chunk ->', chunk([1, 2, 3, 4], 2));

  await concurrent(flat, async (value: number) => value);
  console.log('2. Concurrent -> ran', flat.join(', '), 'at once -> all fulfilled');

  await concurrents(nested, async (value: number) => value);
  console.log(
    '3. Concurrents -> ran groups',
    nested.map((g) => `[${g.join(', ')}]`).join(' + '),
    'at once -> all fulfilled',
  );

  await consecutive(flat, async (value: number) => value);
  console.log('4. Consecutive -> ran', flat.join(' -> '), 'one by one -> all fulfilled');

  await consecutives(nested, async (value: number) => value);
  console.log(
    '5. Consecutives -> ran groups',
    nested.map((g) => `[${g.join(', ')}]`).join(' -> '),
    'one group at a time -> all fulfilled',
  );

  await parallel(flat, async (value: number) => value);
  console.log('6. Parallel -> ran', flat.join(', '), 'in parallel -> all fulfilled');

  const timer = poll(() => {}, 2);
  // Test-only wait; real-world may not await.
  await sleep(3);
  timer.stop();
  console.log('7. Poll -> ticked repeatedly until stopped');

  await sequential(flat, async (value: number) => value);
  console.log('8. Sequential -> ran', flat.join(' -> '), 'in series -> all fulfilled');

  await sleep(1);
  console.log('9. Sleep -> paused ~1ms');

  console.log('10. ToNumber -> "1" ->', toNumber('1'));

  const settled = await untilSettledOrTimedOut(
    async (resolve: (_: boolean) => void, _: unknown, pending: () => boolean) => {
      const value = true;
      // istanbul ignore else
      if (pending()) {
        resolve(value);
      }
    },
    // istanbul ignore next
    (_: unknown, reject: (_: Error) => void) => reject(new Error('timeout')),
    1,
  ).catch(/* istanbul ignore next */ () => false);
  console.log('11. Settle -> finished before timeout -> return', settled);

  const timedOut = await untilSettledOrTimedOut(
    async (resolve: (_: boolean) => void, _: unknown, pending: () => boolean) => {
      // Test-only delay to simulate long processing; real-world may not await.
      await sleep(3);
      const value = true;
      // istanbul ignore if
      if (pending()) {
        resolve(value);
      }
    },
    (_: unknown, reject: (_: Error) => void) => reject(new Error('timeout')),
    2,
  ).catch(() => false);
  console.log('12. Timeout -> took too long -> rejected -> return', timedOut);

  let inflight: boolean | null = true;
  setTimeout(() => {
    inflight = false;
  }, 1);
  await waitFor(() => !inflight, 3, 2);
  console.log('13. WaitFor -> waited ~3ms until condition met');
  // Cleanups.
  inflight = null;

  return 'Timeable Promise Examples';
};

// Auto-run only when executed directly.
// istanbul ignore if
if (require.main === module) {
  module.exports();
}
