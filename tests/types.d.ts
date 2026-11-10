/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description Sets up global test types for Bun.
 * @file types.d.ts
 * @license AGPL-3.0-or-later
 */

/// <reference types="bun-types/test-globals" />

import type { mock as bunMock } from 'bun:test';

declare global {
  const mock: typeof bunMock;
}
