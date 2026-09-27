/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `append()` unit tests.
 * @file append.test.ts
 * @license AGPL-3.0-or-later
 */

import append from '#root/src/append';

/**
 * Registers the unit test suite for the `append` function.
 * @param {typeof append} fn - The append implementation being tested.
 */
export default function testAppend(fn: typeof append) {
  describe('append', () => {
    test.concurrent('should append numbers to an existing array', () => {
      expect(fn([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
    });

    test.concurrent('should append strings to an existing array', () => {
      expect(fn(['a'], ['b', 'c'])).toEqual(['a', 'b', 'c']);
    });

    test.concurrent('should handle appending to an empty accumulator', () => {
      expect(fn([], [1, 2, 3])).toEqual([1, 2, 3]);
    });

    test.concurrent('should handle appending an empty array', () => {
      expect(fn([1, 2, 3], [])).toEqual([1, 2, 3]);
    });

    test.concurrent('should mutate the accumulator array in place', () => {
      const acc = [1, 2];
      const arr = [3];
      // Same reference.
      expect(fn(acc, arr)).toBe(acc);
      expect(acc).toEqual([1, 2, 3]);
    });

    test.concurrent('should work with objects', () => {
      const acc = [{ id: 1 }];
      const arr = [{ id: 2 }, { id: 3 }];
      expect(fn(acc, arr)).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
  });
}

testAppend(append);
