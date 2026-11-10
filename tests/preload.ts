/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description Test preload.
 * @file preload.ts
 * @license AGPL-3.0-or-later
 */

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, mock, test } from 'bun:test';

process.env.TZ = 'UTC';

const assets = {
  methods: {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    mock,
    test,
    xdescribe: describe.skip,
    xtest: test.skip,
  } as const,
};

type MethodKey = keyof typeof assets.methods;

for (const key of Object.keys(assets.methods) as Array<MethodKey>) {
  const value = assets.methods[key as MethodKey];
  if (value !== undefined) {
    Object.defineProperty(globalThis, key, { configurable: true, value, writable: true });
  }
}

afterEach(async () => mock.clearAllMocks());
