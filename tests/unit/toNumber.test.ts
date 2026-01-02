/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description `toNumber()` unit tests.
 * @file toNumber.test.ts
 * @license AGPL-3.0-or-later
 */

import toNumber from '#root/src/toNumber';

// eslint-disable-next-line jest/no-export,jsdoc/require-jsdoc
export default function testToNumber(fn: typeof toNumber) {
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
      expect(fn(value, defaultValue)).toEqual(expected);
    });
  });
}

testToNumber(toNumber);
