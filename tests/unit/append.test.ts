/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `append()` unit tests.
 * @file append.test.ts
 * @license AGPL-3.0-or-later
 */

import append from '#root/src/append';

describe('append', () => {
  test.concurrent('should append numbers to an existing array', () => {
    expect(append([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
  });

  test.concurrent('should append strings to an existing array', () => {
    expect(append(['a'], ['b', 'c'])).toEqual(['a', 'b', 'c']);
  });

  test.concurrent('should handle appending to an empty accumulator', () => {
    expect(append([], [1, 2, 3])).toEqual([1, 2, 3]);
  });

  test.concurrent('should handle appending an empty array', () => {
    expect(append([1, 2, 3], [])).toEqual([1, 2, 3]);
  });

  test.concurrent('should mutate the accumulator array in place', () => {
    const acc = [1, 2];
    const arr = [3];
    // Same reference.
    expect(append(acc, arr)).toBe(acc);
    expect(acc).toEqual([1, 2, 3]);
  });

  test.concurrent('should work with objects', () => {
    const acc = [{ id: 1 }];
    const arr = [{ id: 2 }, { id: 3 }];
    expect(append(acc, arr)).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });
});
