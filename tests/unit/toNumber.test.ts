/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description `toNumber()` unit tests.
 * @file toNumber.test.ts
 * @license AGPL-3.0-or-later
 */

import toNumber from '#root/src/toNumber';

describe('toNumber', () => {
  test.concurrent.each`
    value        | defaultValue | expected
    ${undefined}   ${0}           ${0}
    ${undefined}   ${1}           ${1}
    ${null}        ${1}           ${0}
    ${false}       ${1}           ${0}
    ${true}        ${1}           ${1}
    ${''}          ${1}           ${0}
    ${'a'}         ${1}           ${1}
    ${[]}          ${1}           ${0}
    ${{}}          ${0}           ${0}
    ${{}}          ${1}           ${1}
    ${0}           ${1}           ${0}
    ${1}           ${1}           ${1}
    ${2}           ${1}           ${2}
  `('should return expected', ({ value, defaultValue, expected }) => {
    expect(toNumber(value, defaultValue)).toEqual(expected);
  });
});
