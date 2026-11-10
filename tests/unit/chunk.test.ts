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
  const chunkUndefined = fn as (array?: number[]) => number[] | undefined;
  const chunkString = fn as unknown as (array: string, size: number) => string[];

  describe('chunk', () => {
    test.concurrent('should return chunked array', () => {
      expect(fn<number, number[][]>([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
    });

    test.concurrent('should return original array', () => {
      expect(fn([1, 2, 3])).toEqual([1, 2, 3]);
      expect(chunkUndefined()).toBeUndefined();
    });

    test.concurrent('should return empty array', () => {
      expect(chunkString('', 2)).toEqual([]);
    });
  });
}

testChunk(chunk);
