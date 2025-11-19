/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `append()` unit tests.
 * @file append.test.ts
 * @license AGPL-3.0-or-later
 */

import { append } from '#root/src/append';

describe('append', () => {
  it('should append numbers to an existing array', () => {
    const result = append([1, 2], [3, 4]);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should append strings to an existing array', () => {
    const result = append(['a'], ['b', 'c']);
    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('should handle appending to an empty accumulator', () => {
    const result = append([], [1, 2, 3]);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should handle appending an empty array', () => {
    const result = append([1, 2, 3], []);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should mutate the accumulator array in place', () => {
    const acc = [1, 2];
    const arr = [3];
    const result = append(acc, arr);
    expect(result).toBe(acc); // same reference
    expect(acc).toEqual([1, 2, 3]);
  });

  it('should work with objects', () => {
    const acc = [{ id: 1 }];
    const arr = [{ id: 2 }, { id: 3 }];
    const result = append(acc, arr);
    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });
});
