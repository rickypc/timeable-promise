/*!
 *  runner.js - Benchmark test runner for TimeablePromise.
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

const Benchmark = require('benchmark');

Benchmark.options.maxTime = 0;
Benchmark.options.minSamples = 5;

module.exports = (name, fn) => new Promise((resolve) => {
  new Benchmark(name, { defer: true, fn: async (d) => d.resolve(await fn()) })
    .on('complete', (evt) => {
      process.stdout.write(`${evt.target}\n`);
      resolve();
    })
    .on('error', (evt) => {
      throw evt.target.error;
    })
    .run({ async: true });
});
