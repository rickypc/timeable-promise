/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `concurrents()` unit tests.
 * @file concurrents.test.ts
 * @license AGPL-3.0-or-later
 */

import concurrents from '#root/src/concurrents';

describe('concurrents', () => {
  test('should fulfilled with concurrency', async () => {
    expect(await concurrents([['a', 'b'], ['c']], (value) => value)).toEqual([
      { status: 'fulfilled', value: 'a' },
      { status: 'fulfilled', value: 'b' },
      { status: 'fulfilled', value: 'c' },
    ]);
  }, 2);

  test('should fulfilled without concurrency', async () => {
    expect(await concurrents([['a', 'b'], ['c']], (value) => value)).toEqual([
      { status: 'fulfilled', value: 'a' },
      { status: 'fulfilled', value: 'b' },
      { status: 'fulfilled', value: 'c' },
    ]);
  });

  test('should rejected with concurrency', async () => {
    expect(await concurrents([['a', 'b'], ['c']], () => Promise.reject(Error('error')), 2))
      .toEqual([
        { reason: expect.any(Error), status: 'rejected' },
        { reason: expect.any(Error), status: 'rejected' },
      ]);
  });

  test('should rejected without concurrency', async () => {
    expect(await concurrents([['a', 'b'], ['c']], () => Promise.reject(Error('error'))))
      .toEqual([
        { reason: expect.any(Error), status: 'rejected' },
        { reason: expect.any(Error), status: 'rejected' },
        { reason: expect.any(Error), status: 'rejected' },
      ]);
  });
});
