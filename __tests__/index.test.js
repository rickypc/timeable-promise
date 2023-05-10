/*!
 *  index.test.js - tests for TimeablePromise functionality.
 *  Copyright (c) 2018 - 2023 Richard Huang <rickypc@users.noreply.github.com>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const {
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
} = require('../index.js');

const hrtimeToMs = (value) => (value[0] * 1000000000 + value[1]) / 1000000;

describe('TimeablePromise module test', () => {
  describe('chunk', () => {
    it('should return chunked array', () => {
      expect(chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
    });

    it('should return original array', () => {
      expect(chunk([1, 2, 3])).toEqual([1, 2, 3]);
      expect(chunk()).toBeUndefined();
    });

    it('should return empty array', () => {
      expect(chunk('', 2)).toEqual([]);
    });
  });

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

  describe('concurrents', () => {
    it('should fulfilled with concurrency', async () => {
      expect(await concurrents([['a', 'b'], ['c']], (value) => value)).toEqual([
        { status: 'fulfilled', value: 'a' },
        { status: 'fulfilled', value: 'b' },
        { status: 'fulfilled', value: 'c' },
      ]);
    }, 2);

    it('should fulfilled without concurrency', async () => {
      expect(await concurrents([['a', 'b'], ['c']], (value) => value)).toEqual([
        { status: 'fulfilled', value: 'a' },
        { status: 'fulfilled', value: 'b' },
        { status: 'fulfilled', value: 'c' },
      ]);
    });

    it('should rejected with concurrency', async () => {
      expect(await concurrents([['a', 'b'], ['c']], () => Promise.reject(Error('error')), 2))
        .toEqual([
          { reason: expect.any(Error), status: 'rejected' },
          { reason: expect.any(Error), status: 'rejected' },
        ]);
    });

    it('should rejected without concurrency', async () => {
      expect(await concurrents([['a', 'b'], ['c']], () => Promise.reject(Error('error'))))
        .toEqual([
          { reason: expect.any(Error), status: 'rejected' },
          { reason: expect.any(Error), status: 'rejected' },
          { reason: expect.any(Error), status: 'rejected' },
        ]);
    });
  });

  describe('consecutive', () => {
    it('should fulfilled with concurrency', async () => {
      expect(await consecutive(['a', 'b', 'c'], (value) => value, 2)).toEqual([
        { status: 'fulfilled', value: ['a', 'b'] },
        { status: 'fulfilled', value: ['c'] },
      ]);
    });

    it('should fulfilled without concurrency', async () => {
      expect(await consecutive(['a', 'b', 'c'], (value) => value)).toEqual([
        { status: 'fulfilled', value: 'a' },
        { status: 'fulfilled', value: 'b' },
        { status: 'fulfilled', value: 'c' },
      ]);
    });

    it('should rejected with concurrency', async () => {
      expect(await consecutive(['a', 'b', 'c'], () => Promise.reject(Error('error')), 2))
        .toEqual([
          { reason: expect.any(Error), status: 'rejected' },
          { reason: expect.any(Error), status: 'rejected' },
        ]);
    });

    it('should rejected without concurrency', async () => {
      expect(await consecutive(['a', 'b', 'c'], () => Promise.reject(Error('error'))))
        .toEqual([
          { reason: expect.any(Error), status: 'rejected' },
          { reason: expect.any(Error), status: 'rejected' },
          { reason: expect.any(Error), status: 'rejected' },
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

    it('should fulfilled without concurrency', async () => {
      expect(await consecutives([['a', 'b'], ['c']], (value) => value)).toEqual([
        { status: 'fulfilled', value: 'a' },
        { status: 'fulfilled', value: 'b' },
        { status: 'fulfilled', value: 'c' },
      ]);
    });

    it('should rejected with concurrency', async () => {
      expect(await consecutives([['a', 'b'], ['c']], () => Promise.reject(Error('error')), 2))
        .toEqual([
          { reason: expect.any(Error), status: 'rejected' },
          { reason: expect.any(Error), status: 'rejected' },
        ]);
    });

    it('should rejected without concurrency', async () => {
      expect(await consecutives([['a', 'b'], ['c']], () => Promise.reject(Error('error'))))
        .toEqual([
          { reason: expect.any(Error), status: 'rejected' },
          { reason: expect.any(Error), status: 'rejected' },
          { reason: expect.any(Error), status: 'rejected' },
        ]);
    });
  });

  describe('parallel', () => {
    it('should fulfilled with concurrency', async () => {
      expect(await parallel(['a', 'b', 'c'], (value) => value, 2)).toEqual([
        { status: 'fulfilled', value: ['a', 'b'] },
        { status: 'fulfilled', value: ['c'] },
      ]);
    }, 2);

    it('should fulfilled without concurrency', async () => {
      expect(await parallel(['a', 'b', 'c'], (value) => value)).toEqual([
        { status: 'fulfilled', value: 'a' },
        { status: 'fulfilled', value: 'b' },
        { status: 'fulfilled', value: 'c' },
      ]);
    });

    it('should rejected with concurrency', async () => {
      expect(await parallel(['a', 'b', 'c'], () => Promise.reject(Error('error')), 2))
        .toEqual([
          { reason: expect.any(Error), status: 'rejected' },
          { reason: expect.any(Error), status: 'rejected' },
        ]);
    });

    it('should rejected without concurrency', async () => {
      expect(await parallel(['a', 'b', 'c'], () => Promise.reject(Error('error'))))
        .toEqual([
          { reason: expect.any(Error), status: 'rejected' },
          { reason: expect.any(Error), status: 'rejected' },
          { reason: expect.any(Error), status: 'rejected' },
        ]);
    });
  });

  describe('poll', () => {
    it('should run at interval', async () => {
      const log = jest.fn();
      const timer = poll(log);
      setTimeout(() => timer.stop(), 1100);
      await sleep(1200);

      expect(log).toHaveBeenCalledTimes(1);
    });

    it('should skip on congestion', async () => {
      let count = 1;
      const log = jest.fn();
      const timer = poll(async (stopped) => {
        await sleep(98 + count);
        if (!stopped()) {
          log();
          count += 1;
        }
      }, 100, true);
      setTimeout(() => timer.stop(), 1000);
      await sleep(1100);

      expect(log).toHaveBeenCalledTimes(5);
    });
  });

  describe('sequential', () => {
    it('should fulfilled with concurrency', async () => {
      expect(await sequential(['a', 'b', 'c'], (value) => value, 2)).toEqual([
        { status: 'fulfilled', value: ['a', 'b'] },
        { status: 'fulfilled', value: ['c'] },
      ]);
    }, 2);

    it('should fulfilled without concurrency', async () => {
      expect(await sequential(['a', 'b', 'c'], (value) => value)).toEqual([
        { status: 'fulfilled', value: 'a' },
        { status: 'fulfilled', value: 'b' },
        { status: 'fulfilled', value: 'c' },
      ]);
    });

    it('should rejected with concurrency', async () => {
      expect(await sequential(['a', 'b', 'c'], () => Promise.reject(Error('error')), 2))
        .toEqual([
          { reason: expect.any(Error), status: 'rejected' },
          { reason: expect.any(Error), status: 'rejected' },
        ]);
    });

    it('should rejected without concurrency', async () => {
      expect(await sequential(['a', 'b', 'c'], () => Promise.reject(Error('error'))))
        .toEqual([
          { reason: expect.any(Error), status: 'rejected' },
          { reason: expect.any(Error), status: 'rejected' },
          { reason: expect.any(Error), status: 'rejected' },
        ]);
    });
  });

  describe('sleep', () => {
    it('should sleep', async () => {
      const begin = process.hrtime();
      await sleep(100);
      const end = process.hrtime(begin);

      expect(hrtimeToMs(end)).toBeGreaterThan(50);
    });
  });

  describe('toNumber', () => {
    it.each`
      value        | defaultValue | expected
      ${undefined}   ${0}           ${0}
      ${undefined}   ${1}           ${1}
      ${null}        ${1}           ${0}
      ${false}       ${1}           ${0}
      ${true}        ${1}           ${1}
      ${''}          ${1}           ${0}
      ${'a'}         ${1}           ${1}
      ${[]}          ${1}           ${0}
      ${{}}          ${0}           ${0}
      ${{}}          ${1}           ${1}
      ${0}           ${1}           ${0}
      ${1}           ${1}           ${1}
      ${2}           ${1}           ${2}
    `('should return expected', ({ value, defaultValue, expected }) => {
      expect(toNumber(value, defaultValue)).toEqual(expected);
    });
  });

  describe('untilSettledOrTimedOut', () => {
    it('should return resolved', async () => {
      const actual = await untilSettledOrTimedOut(async (resolve, reject, pending) => {
        await sleep(10);
        expect(pending()).toBeTruthy();
        resolve('executor');
      }, (resolve) => resolve('timeout'), 100);
      expect(actual).toEqual('executor');
    });

    it('should return rejected', async () => {
      const actual = await untilSettledOrTimedOut(async (resolve, reject, pending) => {
        await sleep(10);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(pending()).toBeTruthy();
        reject('executor');
      }, (resolve) => resolve('timeout'), 100)
        // eslint-disable-next-line jest/no-conditional-expect
        .catch((ex) => expect(ex).toEqual('executor'));
      expect(actual).toBeUndefined();
    });

    it('should return timed out resolved', async () => {
      const actual = await untilSettledOrTimedOut(async (resolve, reject, pending) => {
        await sleep(200);
        expect(pending()).toBeFalsy();
        resolve('executor');
      }, (resolve) => resolve('timeout'), 100);
      expect(actual).toEqual('timeout');
    });

    it('should return timed out rejected', async () => {
      const actual = await untilSettledOrTimedOut(async (resolve, reject, pending) => {
        await sleep(200);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(pending()).toBeFalsy();
        resolve('executor');
      }, (resolve, reject) => reject('timeout'), 100)
        // eslint-disable-next-line jest/no-conditional-expect
        .catch((ex) => expect(ex).toEqual('timeout'));
      expect(actual).toBeUndefined();
    });
  });

  describe('waitFor', () => {
    it('should return resolved', async () => {
      let inflight = true;
      setTimeout(() => {
        inflight = false;
      }, 50);

      const begin = process.hrtime();
      await waitFor(() => !inflight, 100, 50);
      const end = process.hrtime(begin);

      expect(hrtimeToMs(end)).toBeLessThan(100);
    });

    it('should return resolved with default interval', async () => {
      const inflight = false;

      const begin = process.hrtime();
      await waitFor(() => !inflight, 2000);
      const end = process.hrtime(begin);

      expect(hrtimeToMs(end)).toBeLessThan(2000);
    });

    it('should return timed out resolved', async () => {
      const inflight = true;

      const begin = process.hrtime();
      await waitFor(() => !inflight, 100, 50);
      const end = process.hrtime(begin);

      expect(hrtimeToMs(end)).toBeGreaterThan(50);
    });
  });
});
