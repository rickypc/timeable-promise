// eslint-disable-next-line import/no-unresolved
const { untilSettledOrTimedOut, waitFor } = require('timeable-promise');

(async () => {
  const logs = ['1. Settle Example'];
  let response = await untilSettledOrTimedOut(async (resolve, reject, pending) => {
    // Simulate processing time shorter than timeout.
    const processed = await new Promise((done) => {
      setTimeout(done, 10, true);
    });
    if (pending()) {
      logs.push(`   => resolving: ${processed}`);
      resolve(processed);
    }
  }, (_, reject) => {
    logs.push('   => rejecting: timeout');
    reject(Error('timeout'));
  }, 100)
    .catch((ex) => {
      logs.push(`   => exception message: ${ex.message}`);
      return false;
    });
  logs.push(`   => response: ${response}`);

  logs.push('2. Timeout Example');
  response = await untilSettledOrTimedOut(async (resolve, reject, pending) => {
    // Simulate processing time longer than timeout.
    const processed = await new Promise((done) => {
      setTimeout(done, 100, true);
    });
    if (pending()) {
      logs.push(`   => resolving: ${processed}`);
      resolve(processed);
    }
  }, (_, reject) => {
    logs.push('   => rejecting: timeout');
    reject(Error('timeout'));
  }, 10)
    .catch((ex) => {
      logs.push(`   => exception message: ${ex.message}`);
      return false;
    });
  logs.push(`   => response: ${response}`);

  logs.push('3. Wait Example');
  // Simulate long process running.
  let inflight = true;
  const predicate = () => !inflight;
  const timeout = 5000;
  setTimeout(() => {
    // Simulate long process completion.
    inflight = false;
  }, 1000);
  // eslint-disable-next-line no-console
  console.time('Wait');
  await waitFor(predicate, timeout);

  // eslint-disable-next-line no-console
  console.log(...logs);
  // eslint-disable-next-line no-console
  console.timeEnd('Wait');

  return 'Timeable Promise Examples';
})();
