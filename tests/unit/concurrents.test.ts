/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `concurrents()` unit tests.
 * @file concurrents.test.ts
 * @license AGPL-3.0-or-later
 */

import concurrents from '#root/src/concurrents';

// eslint-disable-next-line jest/no-export,jsdoc/require-jsdoc
export default function testConcurrents(fn: typeof concurrents) {
  describe('concurrents', () => {
    test.concurrent('should fulfilled with concurrency', async () => {
      expect(await fn([['a', 'b'], ['c']], (value) => value)).toEqual([
        { status: 'fulfilled', value: 'a' },
        { status: 'fulfilled', value: 'b' },
        { status: 'fulfilled', value: 'c' },
      ]);
    }, 2);

    test.concurrent('should fulfilled without concurrency', async () => {
      expect(await fn([['a', 'b'], ['c']], (value) => value)).toEqual([
        { status: 'fulfilled', value: 'a' },
        { status: 'fulfilled', value: 'b' },
        { status: 'fulfilled', value: 'c' },
      ]);
    });

    test.concurrent('should rejected with concurrency', async () => {
      expect(await fn([['a', 'b'], ['c']], () => Promise.reject(Error('error')), 2))
        .toEqual([
          { reason: expect.any(Error), status: 'rejected' },
          { reason: expect.any(Error), status: 'rejected' },
        ]);
    });

    test.concurrent('should rejected without concurrency', async () => {
      expect(await fn([['a', 'b'], ['c']], () => Promise.reject(Error('error'))))
        .toEqual([
          { reason: expect.any(Error), status: 'rejected' },
          { reason: expect.any(Error), status: 'rejected' },
          { reason: expect.any(Error), status: 'rejected' },
        ]);
    });
  });
}

testConcurrents(concurrents);
