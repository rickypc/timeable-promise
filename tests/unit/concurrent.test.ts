/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `concurrent()` unit tests.
 * @file concurrent.test.ts
 * @license AGPL-3.0-or-later
 */

import concurrent from '#root/src/concurrent';

describe('concurrent', () => {
  it('should fulfilled with concurrency', async () => {
    expect(await concurrent(['a', 'b', 'c'], (value) => value, 2)).toEqual([
      { status: 'fulfilled', value: ['a', 'b'] },
      { status: 'fulfilled', value: ['c'] },
    ]);
  });

  it('should fulfilled without concurrency', async () => {
    expect(await concurrent(['a', 'b', 'c'], (value) => value)).toEqual([
      { status: 'fulfilled', value: 'a' },
      { status: 'fulfilled', value: 'b' },
      { status: 'fulfilled', value: 'c' },
    ]);
  });

  it('should rejected with concurrency', async () => {
    expect(await concurrent(['a', 'b', 'c'], () => Promise.reject(Error('error')), 2))
      .toEqual([
        { reason: expect.any(Error), status: 'rejected' },
        { reason: expect.any(Error), status: 'rejected' },
      ]);
  });

  it('should rejected without concurrency', async () => {
    expect(await concurrent(['a', 'b', 'c'], () => Promise.reject(Error('error'))))
      .toEqual([
        { reason: expect.any(Error), status: 'rejected' },
        { reason: expect.any(Error), status: 'rejected' },
        { reason: expect.any(Error), status: 'rejected' },
      ]);
  });
});
