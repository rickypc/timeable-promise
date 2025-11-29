/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `waitFor()` unit tests.
 * @file waitFor.test.ts
 * @license AGPL-3.0-or-later
 */

import { hrtimeToMs } from '#root/tests/utils';
import waitFor from '#root/src/waitFor';

describe('waitFor', () => {
  test.concurrent('should return resolved', async () => {
    let inflight = true;
    setTimeout(() => { inflight = false; }, 1);

    const begin = process.hrtime();
    await waitFor(() => !inflight, 2, 1);
    const end = process.hrtime(begin);

    expect(hrtimeToMs(end)).toBeLessThan(10);
  });

  test.concurrent('should return resolved with default interval', async () => {
    const inflight = false;

    const begin = process.hrtime();
    await waitFor(() => !inflight, 1);
    const end = process.hrtime(begin);

    expect(hrtimeToMs(end)).toBeLessThan(10);
  });

  test.concurrent('should return timed out resolved', async () => {
    const inflight = true;

    const begin = process.hrtime();
    await waitFor(() => !inflight, 2, 1);
    const end = process.hrtime(begin);

    expect(hrtimeToMs(end)).toBeGreaterThan(1);
  });
});
