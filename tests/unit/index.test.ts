/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Unit tests for index.ts.
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
import { hrtimeToMs } from '#root/tests/utils';
import testAppend from '#root/tests/unit/append.test';
import testChunk from '#root/tests/unit/chunk.test';
import testConcurrent from '#root/tests/unit/concurrent.test';
import testConcurrents from '#root/tests/unit/concurrents.test';
import testConsecutive from '#root/tests/unit/consecutive.test';
import testConsecutives from '#root/tests/unit/consecutives.test';
import testOutcome from '#root/tests/unit/outcome.test';
import testParallel from '#root/tests/unit/parallel.test';
import testPoll from '#root/tests/unit/poll.test';
import testSequential from '#root/tests/unit/sequential.test';
import testSleep from '#root/tests/unit/sleep.test';
import testToNumber from '#root/tests/unit/toNumber.test';
import testUntilSettledOrTimedOut from '#root/tests/unit/untilSettledOrTimedOut.test';
import testWaitFor from '#root/tests/unit/waitFor.test';

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
