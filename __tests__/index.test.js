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
  poll,
  sleep,
  untilSettledOrTimedOut,
  waitFor,
} = require('../index.js');

const hrtimeToMs = (value) => (value[0] * 1000000000 + value[1]) / 1000000;

describe('TimeablePromise module test', () => {
  describe('poll', () => {
    it('should run at interval', async () => {
      const log = jest.fn();
      const timer = poll(log);
      setTimeout(() => timer.stop(), 2000);
      await sleep(2100);

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

  describe('sleep', () => {
    it('should sleep', async () => {
      const begin = process.hrtime();
      await sleep(100);
      const end = process.hrtime(begin);

      expect(hrtimeToMs(end)).toBeGreaterThan(50);
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
