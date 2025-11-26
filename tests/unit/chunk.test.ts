/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `chunk()` unit tests.
 * @file chunk.test.ts
 * @license AGPL-3.0-or-later
 */

import chunk from '#root/src/chunk';

describe('chunk', () => {
  test.concurrent('should return chunked array', () => {
    expect(chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
  });

  test.concurrent('should return original array', () => {
    expect(chunk([1, 2, 3])).toEqual([1, 2, 3]);
    expect(chunk(undefined as any)).toBeUndefined();
  });

  test.concurrent('should return empty array', () => {
    expect(chunk('' as any, 2)).toEqual([]);
  });
});
