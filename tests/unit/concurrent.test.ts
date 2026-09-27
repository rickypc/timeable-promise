/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `concurrent()` unit tests.
 * @file concurrent.test.ts
 * @license AGPL-3.0-or-later
 */

import concurrent from '#root/src/concurrent';

/**
 * Registers the unit test suite for the `concurrent` function.
 * @param {typeof concurrent} fn - The concurrent implementation being tested.
 */
export default function testConcurrent(fn: typeof concurrent) {
  describe('concurrent', () => {
    test.concurrent('should fulfilled with concurrency', async () => {
      expect(await fn(['a', 'b', 'c'], (value) => value, 2)).toEqual([
        { status: 'fulfilled', value: ['a', 'b'] },
        { status: 'fulfilled', value: ['c'] },
      ]);
    });

    test.concurrent('should fulfilled without concurrency', async () => {
      expect(await fn<unknown>(['a', 'b', 'c'], (value) => value)).toEqual([
        { status: 'fulfilled', value: 'a' },
        { status: 'fulfilled', value: 'b' },
        { status: 'fulfilled', value: 'c' },
      ]);
    });

    test.concurrent('should rejected with concurrency', async () => {
      expect(await fn(['a', 'b', 'c'], () => Promise.reject(new Error('error')), 2)).toEqual([
        { reason: expect.any(Error), status: 'rejected' },
        { reason: expect.any(Error), status: 'rejected' },
      ]);
    });

    test.concurrent('should rejected without concurrency', async () => {
      expect(await fn(['a', 'b', 'c'], () => Promise.reject(new Error('error')))).toEqual([
        { reason: expect.any(Error), status: 'rejected' },
        { reason: expect.any(Error), status: 'rejected' },
        { reason: expect.any(Error), status: 'rejected' },
      ]);
    });
  });
}

testConcurrent(concurrent);
