/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Unit tests for index.ts.
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
import { hrtimeToMs } from '#root/tests/utils';

describe('index.ts', () => {
  describe('chunk', () => {
    it('should return chunked array', () => {
      expect(chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
    });
  });

  describe('concurrent', () => {
    it('should fulfilled with concurrency', async () => {
      expect(await concurrent(['a', 'b', 'c'], (value) => value, 2)).toEqual([
        { status: 'fulfilled', value: ['a', 'b'] },
        { status: 'fulfilled', value: ['c'] },
      ]);
    });
  });

  describe('concurrents', () => {
    it('should fulfilled with concurrency', async () => {
      expect(await concurrents([['a', 'b'], ['c']], (value) => value)).toEqual([
        { status: 'fulfilled', value: 'a' },
        { status: 'fulfilled', value: 'b' },
        { status: 'fulfilled', value: 'c' },
      ]);
    }, 2);
  });

  describe('consecutive', () => {
    it('should fulfilled with concurrency', async () => {
      expect(await consecutive(['a', 'b', 'c'], (value) => value, 2)).toEqual([
        { status: 'fulfilled', value: ['a', 'b'] },
        { status: 'fulfilled', value: ['c'] },
      ]);
    });
  });

  describe('consecutives', () => {
    it('should fulfilled with concurrency', async () => {
      expect(await consecutives([['a', 'b'], ['c']], (value) => value)).toEqual([
        { status: 'fulfilled', value: 'a' },
        { status: 'fulfilled', value: 'b' },
        { status: 'fulfilled', value: 'c' },
      ]);
    }, 2);
  });

  describe('parallel', () => {
    it('should fulfilled with concurrency', async () => {
      expect(await parallel(['a', 'b', 'c'], (value) => value, 2)).toEqual([
        { status: 'fulfilled', value: ['a', 'b'] },
        { status: 'fulfilled', value: ['c'] },
      ]);
    }, 2);
  });

  describe('poll', () => {
    it('should run at interval', async () => {
      jest.useFakeTimers();
      const log = jest.fn();
      const timer = poll(log);
      setTimeout(() => timer.stop(), 1100);
      await jest.advanceTimersByTimeAsync(1100);

      expect(log).toHaveBeenCalledTimes(1);
      jest.useRealTimers();
    });
  });

  describe('sequential', () => {
    it('should fulfilled with concurrency', async () => {
      expect(await sequential(['a', 'b', 'c'], (value) => value, 2)).toEqual([
        { status: 'fulfilled', value: ['a', 'b'] },
        { status: 'fulfilled', value: ['c'] },
      ]);
    }, 2);
  });

  describe('sleep', () => {
    it('should sleep', async () => {
      jest.useFakeTimers();
      const begin = process.hrtime();
      const promise = sleep(100);
      await jest.advanceTimersByTimeAsync(100);
      await promise;
      const end = process.hrtime(begin);

      expect(hrtimeToMs(end)).toBeGreaterThan(50);
      jest.useRealTimers();
    });
  });

  describe('toNumber', () => {
    it('should return expected', () => {
      expect(toNumber('1')).toBe(1);
    });
  });

  describe('untilSettledOrTimedOut', () => {
    it('should return resolved', async () => {
      jest.useFakeTimers();
      const actual = await untilSettledOrTimedOut(async (resolve, _, pending) => {
        const promise = sleep(10);
        await jest.advanceTimersByTimeAsync(10);
        await promise;
        expect(pending()).toBeTruthy();
        resolve('executor');
      }, (resolve) => resolve('timeout'), 100);
      expect(actual).toBe('executor');
      jest.useRealTimers();
    });
  });

  describe('waitFor', () => {
    it('should return resolved', async () => {
      jest.useFakeTimers();
      let inflight = true;
      setTimeout(() => {
        inflight = false;
      }, 50);

      const begin = process.hrtime();
      const promise = waitFor(() => !inflight, 100, 50);
      await jest.advanceTimersByTimeAsync(50);
      await promise;
      const end = process.hrtime(begin);

      expect(hrtimeToMs(end)).toBeLessThan(100);
      jest.useRealTimers();
    });
  });
});
