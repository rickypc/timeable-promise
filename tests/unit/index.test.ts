/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Unit tests for index.ts.
 * @file index.test.ts
 * @license AGPL-3.0-or-later
 */

import {
  append,
  chunk,
  concurrent,
  concurrents,
  consecutive,
  consecutives,
  type ItemExecutor,
  outcome,
  parallel,
  poll,
  sequential,
  sleep,
  toNumber,
  untilSettledOrTimedOut,
  waitFor,
} from '#root/src/index';
import { hrtimeToMs } from '#root/tests/utils';

describe('index.ts', () => {
  test.concurrent('append should append numbers to an existing array', () => {
    expect(append([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
  });

  test.concurrent('chunk should return chunked array', () => {
    expect(chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
  });

  test.concurrent('concurrent should fulfilled with concurrency', async () => {
    expect(await concurrent(['a', 'b', 'c'], (value) => value, 2)).toEqual([
      { status: 'fulfilled', value: ['a', 'b'] },
      { status: 'fulfilled', value: ['c'] },
    ]);
  });

  test.concurrent('concurrents should fulfilled with concurrency', async () => {
    expect(await concurrents([['a', 'b'], ['c']], (value) => value)).toEqual([
      { status: 'fulfilled', value: 'a' },
      { status: 'fulfilled', value: 'b' },
      { status: 'fulfilled', value: 'c' },
    ]);
  }, 2);

  test.concurrent('consecutive should fulfilled with concurrency', async () => {
    expect(await consecutive(['a', 'b', 'c'], (value) => value, 2)).toEqual([
      { status: 'fulfilled', value: ['a', 'b'] },
      { status: 'fulfilled', value: ['c'] },
    ]);
  });

  test.concurrent('consecutives should fulfilled with concurrency', async () => {
    expect(await consecutives([['a', 'b'], ['c']], (value) => value)).toEqual([
      { status: 'fulfilled', value: 'a' },
      { status: 'fulfilled', value: 'b' },
      { status: 'fulfilled', value: 'c' },
    ]);
  }, 2);

  test.concurrent('outcome should resolve with fulfilled status and value', async () => {
    const executor: ItemExecutor<number> = (async (x: number, y: number) => x + y) as any;
    const result = await outcome(executor, 2 as any, 3, [2] as any);
    expect(result).toEqual({ status: 'fulfilled', value: 5 });
  });

  test.concurrent('parallel should fulfilled with concurrency', async () => {
    expect(await parallel(['a', 'b', 'c'], (value) => value, 2)).toEqual([
      { status: 'fulfilled', value: ['a', 'b'] },
      { status: 'fulfilled', value: ['c'] },
    ]);
  }, 2);

  test.concurrent('poll should run at interval', async () => {
    const log = jest.fn();
    const timer = poll(log, 2);
    await sleep(3);
    timer.stop();

    expect(log).toHaveBeenCalledTimes(1);
  });

  test.concurrent('sequential should fulfilled with concurrency', async () => {
    expect(await sequential(['a', 'b', 'c'], (value) => value, 2)).toEqual([
      { status: 'fulfilled', value: ['a', 'b'] },
      { status: 'fulfilled', value: ['c'] },
    ]);
  }, 2);

  test.concurrent('sleep should idle', async () => {
    const begin = process.hrtime();
    await sleep(1);
    const end = process.hrtime(begin);

    expect(hrtimeToMs(end)).toBeGreaterThan(0.25);
  });

  test.concurrent('toNumber should return expected', () => {
    expect(toNumber('1')).toBe(1);
  });

  test.concurrent('untilSettledOrTimedOut should return resolved', async () => {
    const actual = await untilSettledOrTimedOut(async (resolve, _, pending) => {
      expect(pending()).toBeTruthy();
      resolve('executor');
    }, (resolve) => resolve('timeout'), 1);
    expect(actual).toBe('executor');
  });

  test.concurrent('waitFor should return resolved', async () => {
    let inflight = true;
    setTimeout(() => { inflight = false; }, 1);
    const begin = process.hrtime();
    await waitFor(() => !inflight, 2, 1);
    const end = process.hrtime(begin);

    expect(hrtimeToMs(end)).toBeLessThan(5);
  });
});
