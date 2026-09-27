/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `consecutives()` unit tests.
 * @file consecutives.test.ts
 * @license AGPL-3.0-or-later
 */

import consecutives from '#root/src/consecutives';

/**
 * Registers the unit test suite for the `consecutives` function.
 * @param {typeof consecutives} fn - The consecutives implementation being tested.
 */
export default function testConsecutives(fn: typeof consecutives) {
  describe('consecutives', () => {
    test.concurrent('should fulfilled with concurrency', async () => {
      expect(await fn<unknown>([['a', 'b'], ['c']], (value) => value)).toEqual([
        { status: 'fulfilled', value: 'a' },
        { status: 'fulfilled', value: 'b' },
        { status: 'fulfilled', value: 'c' },
      ]);
    }, 2);

    test.concurrent('should fulfilled without concurrency', async () => {
      expect(await fn<unknown>([['a', 'b'], ['c']], (value) => value)).toEqual([
        { status: 'fulfilled', value: 'a' },
        { status: 'fulfilled', value: 'b' },
        { status: 'fulfilled', value: 'c' },
      ]);
    });

    test.concurrent('should rejected with concurrency', async () => {
      expect(await fn([['a', 'b'], ['c']], () => Promise.reject(new Error('error')), 2)).toEqual([
        { reason: expect.any(Error), status: 'rejected' },
        { reason: expect.any(Error), status: 'rejected' },
      ]);
    });

    test.concurrent('should rejected without concurrency', async () => {
      expect(await fn([['a', 'b'], ['c']], () => Promise.reject(new Error('error')))).toEqual([
        { reason: expect.any(Error), status: 'rejected' },
        { reason: expect.any(Error), status: 'rejected' },
        { reason: expect.any(Error), status: 'rejected' },
      ]);
    });
  });
}

testConsecutives(consecutives);
