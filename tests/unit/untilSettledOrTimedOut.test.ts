/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `untilSettledOrTimedOut()` unit tests.
 * @file untilSettledOrTimedOut.test.ts
 * @license AGPL-3.0-or-later
 */

import sleep from '#root/src/sleep';
import untilSettledOrTimedOut from '#root/src/untilSettledOrTimedOut';

// eslint-disable-next-line jest/no-export,jsdoc/require-jsdoc
export default function testUntilSettledOrTimedOut(fn: typeof untilSettledOrTimedOut) {
  describe('untilSettledOrTimedOut', () => {
    test.concurrent('should return resolved', async () => {
      const actual = await fn(async (resolve, _, pending) => {
        expect(pending()).toBeTruthy();
        resolve('executor');
      }, (resolve) => resolve('timeout'), 1);
      expect(actual).toBe('executor');
    });

    test.concurrent('should return rejected', async () => {
      const actual = await fn(async (_, reject, pending) => {
        await sleep(2);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(pending()).toBeFalsy();
        reject('executor');
      }, (resolve) => resolve('timeout'), 1)
        // eslint-disable-next-line jest/no-conditional-expect
        .catch((ex) => expect(ex).toBe('executor'));
      expect(actual).toBe('timeout');
    });

    test.concurrent('should return timed out resolved', async () => {
      const actual = await fn(async (resolve, _, pending) => {
        await sleep(2);
        expect(pending()).toBeFalsy();
        resolve('executor');
      }, (resolve) => resolve('timeout'), 1);
      expect(actual).toBe('timeout');
    });

    test.concurrent('should return timed out rejected', async () => {
      const actual = await fn(async (resolve, _, pending) => {
        await sleep(2);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(pending()).toBeFalsy();
        resolve('executor');
      }, (_, reject) => reject('timeout'), 1)
        // eslint-disable-next-line jest/no-conditional-expect
        .catch((ex) => expect(ex).toBe('timeout'));
      expect(actual).toBeUndefined();
    });
  });
}

testUntilSettledOrTimedOut(untilSettledOrTimedOut);
