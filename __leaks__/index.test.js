/*!
 * index.test.js - Leak tests for TimeablePromise functionality.
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
const { untilSettledOrTimedOut, waitFor } = require('../index.js');

(async () => {
  await run('untilSettledOrTimedOut', () => untilSettledOrTimedOut(
    (resolve) => resolve(),
    (resolve) => resolve(),
    1,
  ));
  await run('waitFor', () => waitFor(() => true, 2, 1));
})();
