/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `sequential()` unit tests.
 * @file sequential.test.ts
 * @license AGPL-3.0-or-later
 */

import sequential from '#root/src/sequential';

/**
 * Registers the unit test suite for the `sequential` function.
 * @param {typeof sequential} fn - The sequential implementation being tested.
 */
export default function testSequential(fn: typeof sequential) {
  describe('sequential', () => {
    test.concurrent('should fulfilled with concurrency', async () => {
      expect(await fn(['a', 'b', 'c'], (value) => value, 2)).toEqual([
        { status: 'fulfilled', value: ['a', 'b'] },
        { status: 'fulfilled', value: ['c'] },
      ]);
    }, 2);

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

testSequential(sequential);
