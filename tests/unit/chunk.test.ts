/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `chunk()` unit tests.
 * @file chunk.test.ts
 * @license AGPL-3.0-or-later
 */

import chunk from '#root/src/chunk';

/**
 * Registers the unit test suite for the `chunk` function.
 * @param {typeof chunk} fn - The chunk implementation being tested.
 */
export default function testChunk(fn: typeof chunk) {
  describe('chunk', () => {
    test.concurrent('should return chunked array', () => {
      expect(fn([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
    });

    test.concurrent('should return original array', () => {
      expect(fn([1, 2, 3])).toEqual([1, 2, 3]);
      expect(fn(undefined as any)).toBeUndefined();
    });

    test.concurrent('should return empty array', () => {
      expect(fn('' as any, 2)).toEqual([]);
    });
  });
}

testChunk(chunk);
