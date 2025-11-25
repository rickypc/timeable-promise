/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Resilient tests for index.ts.
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
import { run } from '#root/tests/resilient/runner';

describe('index.ts', () => {
  describe('chunk', () => {
    it('should be resilient', async () => {
      expect(await run(() => chunk([1, 2, 3], 2))).toBeTruthy();
    });
  });

  describe('concurrent', () => {
    it('should be resilient', async () => {
      expect(await run(() => concurrent(['a', 'b', 'c'], (value) => value, 2)))
        .toBeTruthy();
    });
  });

  describe('concurrents', () => {
    it('should be resilient', async () => {
      expect(await run(() => concurrents([['a', 'b'], ['c']], (value) => value)))
        .toBeTruthy();
    });
  });

  describe('consecutive', () => {
    it('should be resilient', async () => {
      expect(await run(() => consecutive(['a', 'b', 'c'], (value) => value, 2)))
        .toBeTruthy();
    });
  });

  describe('consecutives', () => {
    it('should be resilient', async () => {
      expect(await run(() => consecutives([['a', 'b'], ['c']], (value) => value)))
        .toBeTruthy();
    });
  });

  describe('parallel', () => {
    it('should be resilient', async () => {
      expect(await run(() => parallel(['a', 'b', 'c'], (value) => value, 2)))
        .toBeTruthy();
    });
  });

  describe('poll', () => {
    it('should be resilient', async () => {
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
    it('should be resilient', async () => {
      expect(await run(() => sequential(['a', 'b', 'c'], (value) => value, 2)))
        .toBeTruthy();
    });
  });

  describe('sleep', () => {
    it('should be resilient', async () => {
      // 1ns.
      expect(await run(() => sleep(0.000001))).toBeTruthy();
    });
  });

  describe('toNumber', () => {
    it('should be resilient', async () => {
      expect(await run(() => toNumber('0'))).toBeTruthy();
    });
  });

  describe('untilSettledOrTimedOut', () => {
    it('should be resilient', async () => {
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
    it('should be resilient', async () => {
      // 1ns.
      expect(await run(() => waitFor(() => true, 0.000001, 0.000001))).toBeTruthy();
    });
  });
});
