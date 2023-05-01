const {
  parallel,
  poll,
  sequential,
  sleep,
  untilSettledOrTimedOut,
  waitFor,
  // eslint-disable-next-line import/no-unresolved
} = require('timeable-promise');

(async () => {
  const logs = ['1. Parallel Example'];
  const parallelSettled = await parallel(['a', 'b', 'c'], async (value, index) => {
    // Simulate long process running.
    await sleep(100);
    logs.push(`   => parallel: ${index}-${value}`);
    return value;
  });
  logs.push('   => parallel settled: ', parallelSettled);

  let iter = 1;
  logs.push('2. Poll Example');
  const timer = poll(() => {
    logs.push(`   => poll: ${iter += 1}`);
  }, 100);
  setTimeout(() => timer.stop(), 300);

  logs.push('3. Sequential Example');
  const sequentialSettled = await sequential(['a', 'b', 'c'], async (value, index) => {
    // Simulate long process running.
    await sleep(100);
    logs.push(`   => sequential: ${index}-${value}`);
    return value;
  });
  logs.push('   => sequential settled: ', sequentialSettled);

  logs.push('4. Sleep Example');
  const s0 = performance.now();
  await sleep(1000);
  const s1 = performance.now();
  logs.push(`   => slept: ${s1 - s0}ms`);

  logs.push('5. Settle Example');
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

  logs.push('6. Timeout Example');
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

  logs.push('7. WaitFor Example');
  // Simulate long process running.
  let inflight = true;
  const predicate = () => !inflight;
  const timeout = 5000;
  setTimeout(() => {
    // Simulate long process completion.
    inflight = false;
  }, 1000);
  const w0 = performance.now();
  await waitFor(predicate, timeout);
  const w1 = performance.now();
  logs.push(`   => waited: ${w1 - w0}ms`);

  // eslint-disable-next-line no-console
  console.log(...logs);

  return 'Timeable Promise Examples';
})();
