/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Resilient tests for index.ts.
 * @file index.test.ts
 * @license AGPL-3.0-or-later
 */

import {
  append,
  type ArrayExecutor,
  chunk,
  concurrent,
  concurrents,
  consecutive,
  consecutives,
  outcome,
  parallel,
  poll,
  sequential,
  sleep,
  toNumber,
  untilSettledOrTimedOut,
  waitFor,
} from '#root/src/index';
import run from '#root/tests/resilient/runner';

describe('index.ts', () => {
  describe('append', () => {
    test('should be resilient', async () => {
      expect(await run(() => append([1, 2], [3, 4]))).toBeTruthy();
    });
  });

  describe('chunk', () => {
    test('should be resilient', async () => {
      expect(await run(() => chunk([1, 2, 3], 2))).toBeTruthy();
    });
  });

  describe('concurrent', () => {
    test('should be resilient', async () => {
      expect(await run(() => concurrent(['a', 'b', 'c'], (value) => value, 2)))
        .toBeTruthy();
    });
  });

  describe('concurrents', () => {
    test('should be resilient', async () => {
      expect(await run(() => concurrents([['a', 'b'], ['c']], (value) => value)))
        .toBeTruthy();
    });
  });

  describe('consecutive', () => {
    test('should be resilient', async () => {
      expect(await run(() => consecutive(['a', 'b', 'c'], (value) => value, 2)))
        .toBeTruthy();
    });
  });

  describe('consecutives', () => {
    test('should be resilient', async () => {
      expect(await run(() => consecutives([['a', 'b'], ['c']], (value) => value)))
        .toBeTruthy();
    });
  });

  describe('outcome', () => {
    test('should be resilient', async () => {
      const executor: ArrayExecutor<number> = async (x: number, y: number) => x + y;
      expect(await run(() => outcome(executor, 2, 3, [2]))).toBeTruthy();
    });
  });

  describe('parallel', () => {
    test('should be resilient', async () => {
      expect(await run(() => parallel(['a', 'b', 'c'], (value) => value, 2)))
        .toBeTruthy();
    });
  });

  describe('poll', () => {
    test('should be resilient', async () => {
      expect(await run(async () => {
        const timer = poll(() => { });
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            timer.stop();
            resolve();
          }, 0);
        });
      })).toBeTruthy();
    });
  });

  describe('sequential', () => {
    test('should be resilient', async () => {
      expect(await run(() => sequential(['a', 'b', 'c'], (value) => value, 2)))
        .toBeTruthy();
    });
  });

  describe('sleep', () => {
    test('should be resilient', async () => {
      // 1ns.
      expect(await run(() => sleep(0.000001))).toBeTruthy();
    });
  });

  describe('toNumber', () => {
    test('should be resilient', async () => {
      expect(await run(() => toNumber('0'))).toBeTruthy();
    });
  });

  describe('untilSettledOrTimedOut', () => {
    test('should be resilient', async () => {
      expect(await run(async () => {
        await untilSettledOrTimedOut(
          (resolve) => resolve('executor'),
          (resolve) => resolve('timeout'),
          // 1ns.
          0.000001,
        );
      })).toBeTruthy();
    });
  });

  describe('waitFor', () => {
    test('should be resilient', async () => {
      // 1ns.
      expect(await run(() => waitFor(() => true, 0.000001, 0.000001))).toBeTruthy();
    });
  });
});
