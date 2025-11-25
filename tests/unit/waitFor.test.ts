/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `waitFor()` unit tests.
 * @file waitFor.test.ts
 * @license AGPL-3.0-or-later
 */

import { hrtimeToMs } from '#root/tests/utils';
import { waitFor } from '#root/src/waitFor';

describe('waitFor', () => {
  afterEach(() => jest.useRealTimers());
  beforeEach(() => jest.useFakeTimers());

  it('should return resolved', async () => {
    let inflight = true;
    setTimeout(() => {
      inflight = false;
    }, 50);

    const begin = process.hrtime();
    const promise = waitFor(() => !inflight, 100, 50);
    await jest.advanceTimersByTimeAsync(50);
    await promise;
    const end = process.hrtime(begin);

    expect(hrtimeToMs(end)).toBeLessThan(100);
  });

  it('should return resolved with default interval', async () => {
    const inflight = false;

    const begin = process.hrtime();
    const promise = waitFor(() => !inflight, 2000);
    await jest.advanceTimersByTimeAsync(1000);
    await promise;
    const end = process.hrtime(begin);

    expect(hrtimeToMs(end)).toBeLessThan(2000);
  });

  it('should return timed out resolved', async () => {
    const inflight = true;

    const begin = process.hrtime();
    const promise = waitFor(() => !inflight, 100, 50);
    await jest.advanceTimersByTimeAsync(100);
    await promise;
    const end = process.hrtime(begin);

    expect(hrtimeToMs(end)).toBeGreaterThan(50);
  });
});
