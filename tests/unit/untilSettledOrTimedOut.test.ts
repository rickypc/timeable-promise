/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `untilSettledOrTimedOut()` unit tests.
 * @file untilSettledOrTimedOut.test.ts
 * @license AGPL-3.0-or-later
 */

import { sleep } from '#root/src/sleep';
import { untilSettledOrTimedOut } from '#root/src/untilSettledOrTimedOut';

describe('untilSettledOrTimedOut', () => {
  afterEach(() => jest.useRealTimers());
  beforeEach(() => jest.useFakeTimers());

  it('should return resolved', async () => {
    const actual = await untilSettledOrTimedOut(async (resolve, _, pending) => {
      const promise = sleep(10);
      await jest.advanceTimersByTimeAsync(10);
      await promise;
      expect(pending()).toBeTruthy();
      resolve('executor');
    }, (resolve) => resolve('timeout'), 100);
    expect(actual).toBe('executor');
  });

  it('should return rejected', async () => {
    const actual = await untilSettledOrTimedOut(async (_, reject, pending) => {
      const promise = sleep(10);
      await jest.advanceTimersByTimeAsync(10);
      await promise;
      // eslint-disable-next-line jest/no-conditional-expect
      expect(pending()).toBeTruthy();
      reject('executor');
    }, (resolve) => resolve('timeout'), 100)
      // eslint-disable-next-line jest/no-conditional-expect
      .catch((ex) => expect(ex).toBe('executor'));
    expect(actual).toBeUndefined();
  });

  it('should return timed out resolved', async () => {
    const actual = await untilSettledOrTimedOut(async (resolve, _, pending) => {
      const promise = sleep(200);
      await jest.advanceTimersByTimeAsync(200);
      await promise;
      expect(pending()).toBeFalsy();
      resolve('executor');
    }, (resolve) => resolve('timeout'), 100);
    expect(actual).toBe('timeout');
  });

  it('should return timed out rejected', async () => {
    const actual = await untilSettledOrTimedOut(async (resolve, _, pending) => {
      const promise = sleep(200);
      await jest.advanceTimersByTimeAsync(200);
      await promise;
      // eslint-disable-next-line jest/no-conditional-expect
      expect(pending()).toBeFalsy();
      resolve('executor');
    }, (resolve, reject) => reject('timeout'), 100)
      // eslint-disable-next-line jest/no-conditional-expect
      .catch((ex) => expect(ex).toBe('timeout'));
    expect(actual).toBeUndefined();
  });
});
