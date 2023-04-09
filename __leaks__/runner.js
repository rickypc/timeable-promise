/*!
*  runner.js - Leak test runner for TimeablePromise.
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

const memwatch = require('@airbnb/node-memwatch');
const tape = require('tape');

const concurrency = 200;
const concurrents = [...Array(concurrency).keys()];
const exiter = () => process.exit(0);
const iterations = 25;
const log = (t, message) => message.split('\n')
  .forEach((line) => t.emit('result', line));
const max = concurrency * iterations;

process.once('SIGINT', exiter);
process.once('SIGTERM', exiter);

module.exports = (name, fn) => new Promise((resolve) => {
  tape(name, async (t) => {
    t.plan(1);
    let error = null;
    const catcher = (err = {}) => {
      if (err.name === 'MaxListenersExceededWarning') {
        error = error || err;
      }
    };
    const runner = async (count, done) => {
      if (error || count === iterations) {
        done();
        return;
      }
      await fn();
      // Enough time to take a deep breath.
      setTimeout(() => runner(count + 1, done), 25);
    };

    const heapDiff = new memwatch.HeapDiff();
    process.on('warning', catcher);
    await Promise.all(concurrents.map(() => new Promise((done) => { runner(0, done); })));
    process.removeListener('warning', catcher);

    if (error) {
      log(t, error.stack);
      t.fail('event listener leak detected');
      resolve();
      return;
    }

    const diff = heapDiff.end();
    const leaks = diff.change.details.filter((change) => (change['+'] >= max));

    if (leaks.length) {
      log(t, JSON.stringify(diff, null, 2));
      t.fail('memory leak detected');
    } else {
      t.pass('no memory leak detected');
    }

    resolve();
  });
});
