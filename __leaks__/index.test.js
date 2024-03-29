/*!
 * index.test.js - Benchmark tests for TimeablePromise functionality.
 *  Copyright (c) 2018 - 2023 Richard Huang <rickypc@users.noreply.github.com>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const run = require('./runner.js');
const {
  chunk,
  concurrent,
  concurrents,
  consecutive,
  consecutives,
  parallel,
  poll,
  sequential,
  sleep,
  toNumber,
  untilSettledOrTimedOut,
  waitFor,
} = require('../index.js');

(async () => {
  await run('chunk', () => chunk(['a', 'b', 'c'], 2));
  await run('concurrent', async () => {
    await concurrent(['a', 'b', 'c'], (value) => value);
  });
  await run('concurrents', async () => {
    await concurrents([['a', 'b'], ['c']], (value) => value);
  });
  await run('consecutive', async () => {
    await consecutive(['a', 'b', 'c'], (value) => value);
  });
  await run('consecutives', async () => {
    await consecutives([['a', 'b'], ['c']], (value) => value);
  });
  await run('parallel', async () => {
    await parallel(['a', 'b', 'c'], (value) => value);
  });
  await run('poll', async () => {
    const timer = poll(() => {}, 1);
    setTimeout(() => timer.stop(), 3);
    await sleep(5);
  });
  await run('sequential', async () => {
    await sequential(['a', 'b', 'c'], (value) => value);
  });
  await run('sleep', () => sleep(1));
  await run('toNumber', () => toNumber('1'));
  await run('untilSettledOrTimedOut', () => untilSettledOrTimedOut(
    (resolve) => resolve(),
    (resolve) => resolve(),
    1,
  ));
  await run('waitFor', () => waitFor(() => true, 2, 1));
})();
