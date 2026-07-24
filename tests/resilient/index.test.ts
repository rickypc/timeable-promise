/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description Resilient tests for index.ts.
 * @file index.test.ts
 * @license AGPL-3.0-or-later
 */

import {
  append,
  chunk,
  concurrent,
  concurrents,
  consecutive,
  consecutives,
  outcome,
  parallel,
  poll,
  sequential,
  sleep,
  toNumber,
  untilSettledOrTimedOut,
  waitFor,
} from '#root/src/index';
import testAppend from '#root/tests/resilient/append.test';
import testChunk from '#root/tests/resilient/chunk.test';
import testConcurrent from '#root/tests/resilient/concurrent.test';
import testConcurrents from '#root/tests/resilient/concurrents.test';
import testConsecutive from '#root/tests/resilient/consecutive.test';
import testConsecutives from '#root/tests/resilient/consecutives.test';
import testOutcome from '#root/tests/resilient/outcome.test';
import testParallel from '#root/tests/resilient/parallel.test';
import testPoll from '#root/tests/resilient/poll.test';
import testSequential from '#root/tests/resilient/sequential.test';
import testSleep from '#root/tests/resilient/sleep.test';
import testToNumber from '#root/tests/resilient/toNumber.test';
import testUntilSettledOrTimedOut from '#root/tests/resilient/untilSettledOrTimedOut.test';
import testWaitFor from '#root/tests/resilient/waitFor.test';

describe('index.ts', () => {
  testAppend(append);
  testChunk(chunk);
  testConcurrent(concurrent);
  testConcurrents(concurrents);
  testConsecutive(consecutive);
  testConsecutives(consecutives);
  testOutcome(outcome);
  testParallel(parallel);
  testPoll(poll);
  testSequential(sequential);
  testSleep(sleep);
  testToNumber(toNumber);
  testUntilSettledOrTimedOut(untilSettledOrTimedOut);
  testWaitFor(waitFor);
});
