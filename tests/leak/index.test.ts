/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Leak tests for the aggregated functionality exposed via the barrel file.
 * @file index.test.ts
 * @license AGPL-3.0-or-later
 */

import {
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
} from '#root/src/index';
import run from './runner';

(async () => {
  await run('chunk', () => chunk(['a', 'b', 'c'], 2));
  await run('concurrent', async () => {
    await concurrent(['a', 'b', 'c'], (value) => value);
  });
  await run('concurrents', async () => {
    await concurrents([['a', 'b'], ['c']], (value) => value);
  });
  await run('consecutive', async () => {
    await consecutive(['a', 'b', 'c'], (value) => value);
  });
  await run('consecutives', async () => {
    await consecutives([['a', 'b'], ['c']], (value) => value);
  });
  await run('parallel', async () => {
    await parallel(['a', 'b', 'c'], (value) => value);
  });
  await run('poll', async () => {
    const timer = poll(() => { }, 1);
    setTimeout(() => timer.stop(), 3);
    await sleep(5);
  });
  await run('sequential', async () => {
    await sequential(['a', 'b', 'c'], (value) => value);
  });
  await run('sleep', () => sleep(1));
  await run('toNumber', () => toNumber('1'));
  await run('untilSettledOrTimedOut', () => untilSettledOrTimedOut(
    (resolve) => resolve(undefined),
    (resolve) => resolve(undefined),
    1,
  ));
  await run('waitFor', () => waitFor(() => true, 2, 1));
})();
