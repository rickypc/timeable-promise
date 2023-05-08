[![Version](https://img.shields.io/npm/v/timeable-promise)](https://bit.ly/2YFweqU)
[![Downloads](https://img.shields.io/npm/dt/timeable-promise)](https://bit.ly/2YFweqU)
[![Dependency Status](https://img.shields.io/librariesio/github/rickypc/timeable-promise)](https://bit.ly/3MUJErG)
[![Code Style](https://img.shields.io/badge/code%20style-Airbnb-red)](https://bit.ly/2JYN1gk)
[![Build](https://img.shields.io/github/actions/workflow/status/rickypc/timeable-promise/validations.yml)](https://bit.ly/43aA0qF)
[![Coverage](https://img.shields.io/codecov/c/github/rickypc/timeable-promise)](https://bit.ly/2LPRiVj)
[![Vulnerability](https://img.shields.io/snyk/vulnerabilities/github/rickypc/timeable-promise)](https://bit.ly/2yP3kGa)
[![License](https://img.shields.io/npm/l/timeable-promise)](https://bit.ly/2yi7gyO)

Timeable Promise
================

Various asynchronous operations with timeout support.

Installation
-

```bash
$ yarn add timeable-promise
# or
$ npm install --save timeable-promise
```

API Reference
-
Various asynchronous operations with timeout support.

**See**: [Promise](https://mzl.la/2MQJhPC)  
**Example**  
```js
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
} = require('timeable-promise');

// ---------- chunk ----------
const chunked = chunk([1, 2, 3, 4], 2);
console.log('chunked: ', chunked);

// ---------- concurrent ----------
const concurrentSettled = await concurrent([...], (value, index, array) => {
  // Do something promising here...
  return value;
});
console.log('concurrent settled: ', concurrentSettled);

// ---------- concurrents ----------
const concurrentsSettled = await concurrents([...], (value, index, array) => {
  // Do something promising here...
  return value;
});
console.log('concurrents settled: ', concurrentsSettled);

// ---------- consecutive ----------
const consecutiveSettled = await consecutive([...], (value, index, array) => {
  // Do something promising here...
  return value;
});
console.log('consecutive settled: ', consecutiveSettled);

// ---------- consecutives ----------
const consecutivesSettled = await consecutives([...], (value, index, array) => {
  // Do something promising here...
  return value;
});
console.log('consecutives settled: ', consecutivesSettled);

// ---------- parallel ----------
const parallelSettled = await parallel([...], (value, index, array) => {
  // Do something promising here...
  return value;
});
console.log('parallel settled: ', parallelSettled);

// ---------- poll ----------
const timer = poll((stopped) => {
  // Do something promising here...
  if (!stopped()) {
    // Do something when polling is not stopped...
  }
}, 100);
setTimeout(() => {
  // Simulate the end of polling.
  timer.stop();
}, 1000);

// ---------- sequential ----------
const sequentialSettled = await sequential([...], (value, index, array) => {
  // Do something promising here...
  return value;
});
console.log('sequential settled: ', sequentialSettled);

// ---------- sleep ----------
console.time('sleep');
// Sleep for 1s.
await sleep(1000);
console.timeEnd('sleep');

// ---------- toNumber ----------
const converted = toNumber('1');
console.log('converted: ', 1);

// ---------- untilSettledOrTimedOut ----------
const response = await untilSettledOrTimedOut((resolve, reject, pending) => {
  // Promise executor with extra `pending` param to check if promise is not
  // timed-out yet.
  if (pending()) {
    resolve(true);
  }
}, (resolve, reject) => {
  // Timeout executor with option to either resolve or reject the promise.
  reject(Error('error'));
}, 5000)
  .catch(ex => console.log('nay :(', ex));
console.log(`resolved with ${response}, yay!`);

// ---------- waitFor ----------
// Long process running...
let inflight = true
const predicate = () => !inflight;
const timeout = 5000;
setTimeout(() => {
  // Long process done.
  inflight = false;
}, 1000);
console.time('waitFor');
await waitFor(predicate, timeout);
console.timeEnd('waitFor');
```

* [timeable-promise](#module_timeable-promise)
    * [.chunk(array, [size])](#module_timeable-promise.chunk) ⇒ <code>Array</code>
    * [.concurrent(array, executor, [concurrency])](#module_timeable-promise.concurrent) ⇒ <code>Promise.&lt;Array.&lt;module:timeable-promise.concurrent~settled&gt;&gt;</code>
        * [~executor](#module_timeable-promise.concurrent..executor) : <code>function</code>
        * [~settled](#module_timeable-promise.concurrent..settled) : <code>object</code>
    * [.concurrents(array, executor, [concurrency])](#module_timeable-promise.concurrents) ⇒ <code>Promise.&lt;Array.&lt;module:timeable-promise.concurrent~settled&gt;&gt;</code>
    * [.consecutive(array, executor, [concurrency])](#module_timeable-promise.consecutive) ⇒ <code>Promise.&lt;Array.&lt;module:timeable-promise.consecutive~settled&gt;&gt;</code>
        * [~executor](#module_timeable-promise.consecutive..executor) : <code>function</code>
        * [~settled](#module_timeable-promise.consecutive..settled) : <code>object</code>
    * [.consecutives(array, executor, [concurrency])](#module_timeable-promise.consecutives) ⇒ <code>Promise.&lt;Array.&lt;module:timeable-promise.consecutive~settled&gt;&gt;</code>
    * [.parallel(array, executor, [concurrency])](#module_timeable-promise.parallel) ⇒ <code>Promise.&lt;Array.&lt;module:timeable-promise.concurrent~settled&gt;&gt;</code>
    * [.poll(executor, [interval], [immediately])](#module_timeable-promise.poll) ⇒ [<code>timer</code>](#module_timeable-promise.poll..timer)
        * [~executor](#module_timeable-promise.poll..executor) : <code>function</code>
        * [~timer](#module_timeable-promise.poll..timer) : <code>object</code>
    * [.sequential(array, executor, [concurrency])](#module_timeable-promise.sequential) ⇒ <code>Promise.&lt;Array.&lt;module:timeable-promise.consecutive~settled&gt;&gt;</code>
    * [.sleep(timeout)](#module_timeable-promise.sleep) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.toNumber(value, [defaultValue])](#module_timeable-promise.toNumber) ⇒ <code>number</code>
    * [.untilSettledOrTimedOut(executor, timeoutExecutor, timeout)](#module_timeable-promise.untilSettledOrTimedOut) ⇒ <code>Promise.&lt;\*&gt;</code>
        * [~executor](#module_timeable-promise.untilSettledOrTimedOut..executor) : <code>function</code>
        * [~timeoutExecutor](#module_timeable-promise.untilSettledOrTimedOut..timeoutExecutor) : <code>function</code>
    * [.waitFor(predicate, timeout, [interval])](#module_timeable-promise.waitFor) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="module_timeable-promise.chunk"></a>

### timeable-promise.chunk(array, [size]) ⇒ <code>Array</code>
Splits the `array` into groups of `size`.
             The final chunk would be the remaining elements.

**Kind**: static method of [<code>timeable-promise</code>](#module_timeable-promise)  
**Returns**: <code>Array</code> - The chunked array.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array</code> |  | The original array. |
| [size] | <code>number</code> | <code>0</code> | The group size. |

**Example**  
```js
const { chunk } = require('timeable-promise');
const chunked = chunk([1, 2, 3, 4], 2);
console.log('chunked: ', chunked);
```
<a name="module_timeable-promise.concurrent"></a>

### timeable-promise.concurrent(array, executor, [concurrency]) ⇒ <code>Promise.&lt;Array.&lt;module:timeable-promise.concurrent~settled&gt;&gt;</code>
Run `executor` on all `array` items concurrently.

**Kind**: static method of [<code>timeable-promise</code>](#module_timeable-promise)  
**Returns**: <code>Promise.&lt;Array.&lt;module:timeable-promise.concurrent~settled&gt;&gt;</code> - The concurrent outcome objects.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array</code> |  | The array items to be processed by executor. |
| executor | [<code>executor</code>](#module_timeable-promise.concurrent..executor) |  | Executor function. |
| [concurrency] | <code>number</code> | <code>0</code> | The max concurrent execution. |

**Example**  
```js
const { concurrent } = require('timeable-promise');
const concurrentSettled = await concurrent([...], (value, index, array) => {
  // Do something promising here...
  return value;
});
console.log('concurrent settled: ', concurrentSettled);
```

* [.concurrent(array, executor, [concurrency])](#module_timeable-promise.concurrent) ⇒ <code>Promise.&lt;Array.&lt;module:timeable-promise.concurrent~settled&gt;&gt;</code>
    * [~executor](#module_timeable-promise.concurrent..executor) : <code>function</code>
    * [~settled](#module_timeable-promise.concurrent..settled) : <code>object</code>

<a name="module_timeable-promise.concurrent..executor"></a>

#### concurrent~executor : <code>function</code>
Executor function that will be executed concurrently.

**Kind**: inner typedef of [<code>concurrent</code>](#module_timeable-promise.concurrent)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The current value being processed in the array. |
| index | <code>number</code> | The index of the current value being processed in the array. |
| array | <code>Array</code> | The array that is being processed concurrently. |

**Example**  
```js
const executor = (value, index, array) => {
  // Do something promising here...
};
```
<a name="module_timeable-promise.concurrent..settled"></a>

#### concurrent~settled : <code>object</code>
Concurrent outcome object.

**Kind**: inner typedef of [<code>concurrent</code>](#module_timeable-promise.concurrent)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| reason | <code>Error</code> | The exception object. |
| status | <code>string</code> | The outcome status. |
| value | <code>\*</code> | The outcome value. |

<a name="module_timeable-promise.concurrents"></a>

### timeable-promise.concurrents(array, executor, [concurrency]) ⇒ <code>Promise.&lt;Array.&lt;module:timeable-promise.concurrent~settled&gt;&gt;</code>
Run `executor` on all `array` groups concurrently.

**Kind**: static method of [<code>timeable-promise</code>](#module_timeable-promise)  
**Returns**: <code>Promise.&lt;Array.&lt;module:timeable-promise.concurrent~settled&gt;&gt;</code> - The concurrent outcome objects.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array</code> |  | The array groups to be processed by executor. |
| executor | [<code>executor</code>](#module_timeable-promise.concurrent..executor) |  | Executor function. |
| [concurrency] | <code>number</code> | <code>0</code> | The max concurrent execution. |

**Example**  
```js
const { concurrents } = require('timeable-promise');
const concurrentsSettled = await concurrents([...], (value, index, array) => {
  // Do something promising here...
  return value;
});
console.log('concurrents settled: ', concurrentsSettled);
```
<a name="module_timeable-promise.consecutive"></a>

### timeable-promise.consecutive(array, executor, [concurrency]) ⇒ <code>Promise.&lt;Array.&lt;module:timeable-promise.consecutive~settled&gt;&gt;</code>
Run `executor` on all `array` items consecutively.

**Kind**: static method of [<code>timeable-promise</code>](#module_timeable-promise)  
**Returns**: <code>Promise.&lt;Array.&lt;module:timeable-promise.consecutive~settled&gt;&gt;</code> - The consecutive outcome objects.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array</code> |  | The array items to be processed by executor. |
| executor | [<code>executor</code>](#module_timeable-promise.consecutive..executor) |  | Executor function. |
| [concurrency] | <code>number</code> | <code>0</code> | The max consecutive execution. |

**Example**  
```js
const { consecutive } = require('timeable-promise');
const consecutiveSettled = await consecutive([...], (value, index, array) => {
  // Do something promising here...
  return value;
});
console.log('consecutive settled: ', consecutiveSettled);
```

* [.consecutive(array, executor, [concurrency])](#module_timeable-promise.consecutive) ⇒ <code>Promise.&lt;Array.&lt;module:timeable-promise.consecutive~settled&gt;&gt;</code>
    * [~executor](#module_timeable-promise.consecutive..executor) : <code>function</code>
    * [~settled](#module_timeable-promise.consecutive..settled) : <code>object</code>

<a name="module_timeable-promise.consecutive..executor"></a>

#### consecutive~executor : <code>function</code>
Executor function that will be executed consecutively.

**Kind**: inner typedef of [<code>consecutive</code>](#module_timeable-promise.consecutive)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The current value being processed in the array. |
| index | <code>number</code> | The index of the current value being processed in the array. |
| array | <code>Array</code> | The array that is being processed consecutively. |
| accumulator | <code>Array</code> | The outcome array from previous call to this executor. |

**Example**  
```js
const executor = (value, index, array, accumulator) => {
  // Do something promising here...
};
```
<a name="module_timeable-promise.consecutive..settled"></a>

#### consecutive~settled : <code>object</code>
Consecutive outcome object.

**Kind**: inner typedef of [<code>consecutive</code>](#module_timeable-promise.consecutive)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| reason | <code>Error</code> | The exception object. |
| status | <code>string</code> | The outcome status. |
| value | <code>\*</code> | The outcome value. |

<a name="module_timeable-promise.consecutives"></a>

### timeable-promise.consecutives(array, executor, [concurrency]) ⇒ <code>Promise.&lt;Array.&lt;module:timeable-promise.consecutive~settled&gt;&gt;</code>
Run `executor` on all `array` groups consecutively.

**Kind**: static method of [<code>timeable-promise</code>](#module_timeable-promise)  
**Returns**: <code>Promise.&lt;Array.&lt;module:timeable-promise.consecutive~settled&gt;&gt;</code> - The consecutive outcome objects.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array</code> |  | The array groups to be processed by executor. |
| executor | [<code>executor</code>](#module_timeable-promise.consecutive..executor) |  | Executor function. |
| [concurrency] | <code>number</code> | <code>0</code> | The max consecutive execution. |

**Example**  
```js
const { consecutives } = require('timeable-promise');
const consecutivesSettled = await consecutives([...], (value, index, array) => {
  // Do something promising here...
  return value;
});
console.log('consecutives settled: ', consecutivesSettled);
```
<a name="module_timeable-promise.parallel"></a>

### timeable-promise.parallel(array, executor, [concurrency]) ⇒ <code>Promise.&lt;Array.&lt;module:timeable-promise.concurrent~settled&gt;&gt;</code>
Provide parallel execution with `concurrency` support.

**Kind**: static method of [<code>timeable-promise</code>](#module_timeable-promise)  
**Returns**: <code>Promise.&lt;Array.&lt;module:timeable-promise.concurrent~settled&gt;&gt;</code> - The parallel outcome objects.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array</code> |  | The array that is being processed in parallel. |
| executor | [<code>executor</code>](#module_timeable-promise.concurrent..executor) |  | Executor function. |
| [concurrency] | <code>number</code> | <code>0</code> | The max concurrent execution. |

**Example**  
```js
const { parallel } = require('timeable-promise');
const parallelSettled = await parallel([...], (value, index, array) => {
  // Do something promising here...
  return value;
});
console.log('parallel settled: ', parallelSettled);
```
<a name="module_timeable-promise.poll"></a>

### timeable-promise.poll(executor, [interval], [immediately]) ⇒ [<code>timer</code>](#module_timeable-promise.poll..timer)
Provide polling support without congestion when `executor`
             takes longer than `interval`.

**Kind**: static method of [<code>timeable-promise</code>](#module_timeable-promise)  
**Returns**: [<code>timer</code>](#module_timeable-promise.poll..timer) - The return object with stop function.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| executor | [<code>executor</code>](#module_timeable-promise.poll..executor) |  | Executor function. |
| [interval] | <code>number</code> | <code>1000</code> | Delay interval. |
| [immediately] | <code>boolean</code> | <code>false</code> | Run executor immediately in the beginning. |

**Example**  
```js
const { poll } = require('timeable-promise');
const timer = poll((stopped) => {
  // Do something promising here...
  if (!stopped()) {
    // Do something when polling is not stopped...
  }
}, 100);
setTimeout(() => {
  // Simulate the end of polling.
  timer.stop();
}, 1000);
```

* [.poll(executor, [interval], [immediately])](#module_timeable-promise.poll) ⇒ [<code>timer</code>](#module_timeable-promise.poll..timer)
    * [~executor](#module_timeable-promise.poll..executor) : <code>function</code>
    * [~timer](#module_timeable-promise.poll..timer) : <code>object</code>

<a name="module_timeable-promise.poll..executor"></a>

#### poll~executor : <code>function</code>
Executor function that is executed immediately by the Promise implementation.

**Kind**: inner typedef of [<code>poll</code>](#module_timeable-promise.poll)  

| Param | Type | Description |
| --- | --- | --- |
| stopped | <code>function</code> | True if polling is stopped, otherwise false. |

**Example**  
```js
const executor = (stopped) => {
  // Do something promising here...
  if (!stopped()) {
    // Do something when polling is not stopped...
  }
};
```
<a name="module_timeable-promise.poll..timer"></a>

#### poll~timer : <code>object</code>
Timer object containing the polling stop function.

**Kind**: inner typedef of [<code>poll</code>](#module_timeable-promise.poll)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| stop | <code>function</code> | The polling stop function. |

<a name="module_timeable-promise.sequential"></a>

### timeable-promise.sequential(array, executor, [concurrency]) ⇒ <code>Promise.&lt;Array.&lt;module:timeable-promise.consecutive~settled&gt;&gt;</code>
Provide sequential execution with `concurrency` support.

**Kind**: static method of [<code>timeable-promise</code>](#module_timeable-promise)  
**Returns**: <code>Promise.&lt;Array.&lt;module:timeable-promise.consecutive~settled&gt;&gt;</code> - The sequential outcome objects.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array</code> |  | The array that is being processed in sequential. |
| executor | [<code>executor</code>](#module_timeable-promise.consecutive..executor) |  | Executor function. |
| [concurrency] | <code>number</code> | <code>0</code> | The max consecutive execution. |

**Example**  
```js
const { sequential } = require('timeable-promise');
const sequentialSettled = await sequential([...], (value, index, array) => {
  // Do something promising here...
  return value;
});
console.log('sequential settled: ', sequentialSettled);
```
<a name="module_timeable-promise.sleep"></a>

### timeable-promise.sleep(timeout) ⇒ <code>Promise.&lt;void&gt;</code>
Provide sleep support.

**Kind**: static method of [<code>timeable-promise</code>](#module_timeable-promise)  

| Param | Type | Description |
| --- | --- | --- |
| timeout | <code>number</code> | Timeout. |

**Example**  
```js
const { sleep } = require('timeable-promise');
console.time('sleep');
// Sleep for 1s.
await sleep(1000);
console.timeEnd('sleep');
```
<a name="module_timeable-promise.toNumber"></a>

### timeable-promise.toNumber(value, [defaultValue]) ⇒ <code>number</code>
Converts `value` to number.

**Kind**: static method of [<code>timeable-promise</code>](#module_timeable-promise)  
**Returns**: <code>number</code> - The converted number.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>\*</code> |  | The value to be converted to number. |
| [defaultValue] | <code>number</code> | <code>0</code> | The default number. |

**Example**  
```js
const { toNumber } = require('timeable-promise');
const converted = toNumber('1');
console.log('converted: ', 1);
```
<a name="module_timeable-promise.untilSettledOrTimedOut"></a>

### timeable-promise.untilSettledOrTimedOut(executor, timeoutExecutor, timeout) ⇒ <code>Promise.&lt;\*&gt;</code>
Provide `timeout` support on Promise object.

**Kind**: static method of [<code>timeable-promise</code>](#module_timeable-promise)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - Resolve or reject response value.  

| Param | Type | Description |
| --- | --- | --- |
| executor | [<code>executor</code>](#module_timeable-promise.untilSettledOrTimedOut..executor) | Executor function. |
| timeoutExecutor | [<code>timeoutExecutor</code>](#module_timeable-promise.untilSettledOrTimedOut..timeoutExecutor) | Timeout executor function. |
| timeout | <code>number</code> | Timeout. |

**Example**  
```js
const { untilSettledOrTimedOut } = require('timeable-promise');
const executor = (resolve, reject, pending) => {
  // Do something promising here...
  if (pending()) {
    try {
      // Do something more promising here...
      resolve(true);
    } catch (ex) {
      reject(false);
    }
  }
};
const timeoutExecutor = (resolve, reject) => {
  try {
    resolve(true);
  } catch (ex) {
    reject(false);
  }
};
const timeout = 5000;
const response = await untilSettledOrTimedOut(executor, timeoutExecutor, timeout)
  .catch(ex => console.log('nay :(', ex));
console.log(`resolved with ${response}, yay!`);
```

* [.untilSettledOrTimedOut(executor, timeoutExecutor, timeout)](#module_timeable-promise.untilSettledOrTimedOut) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [~executor](#module_timeable-promise.untilSettledOrTimedOut..executor) : <code>function</code>
    * [~timeoutExecutor](#module_timeable-promise.untilSettledOrTimedOut..timeoutExecutor) : <code>function</code>

<a name="module_timeable-promise.untilSettledOrTimedOut..executor"></a>

#### untilSettledOrTimedOut~executor : <code>function</code>
Executor function that is executed immediately by the Promise implementation.

**Kind**: inner typedef of [<code>untilSettledOrTimedOut</code>](#module_timeable-promise.untilSettledOrTimedOut)  

| Param | Type | Description |
| --- | --- | --- |
| resolve | <code>function</code> | Resolve the promise. |
| reject | <code>function</code> | Reject the promise. |
| pending | <code>function</code> | True if Promise is not timed out, otherwise false. |

**Example**  
```js
const executor = (resolve, reject, pending) => {
  // Do something promising here...
  if (pending()) {
    try {
      // Do something more promising here...
      resolve(true);
    } catch (ex) {
      reject(false);
    }
  }
};
```
<a name="module_timeable-promise.untilSettledOrTimedOut..timeoutExecutor"></a>

#### untilSettledOrTimedOut~timeoutExecutor : <code>function</code>
Timeout executor function that is executed when timeout is reached.

**Kind**: inner typedef of [<code>untilSettledOrTimedOut</code>](#module_timeable-promise.untilSettledOrTimedOut)  

| Param | Type | Description |
| --- | --- | --- |
| resolve | <code>function</code> | Resolve the promise. |
| reject | <code>function</code> | Reject the promise. |

**Example**  
```js
const timeoutExecutor = (resolve, reject) => {
  try {
    resolve(true);
  } catch (ex) {
    reject(false);
  }
};
```
<a name="module_timeable-promise.waitFor"></a>

### timeable-promise.waitFor(predicate, timeout, [interval]) ⇒ <code>Promise.&lt;void&gt;</code>
Provide waiting support on given `predicate`.

**Kind**: static method of [<code>timeable-promise</code>](#module_timeable-promise)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| predicate | <code>function</code> |  | Predicate function. |
| timeout | <code>number</code> |  | Timeout. |
| [interval] | <code>number</code> | <code>1000</code> | Check interval. |

**Example**  
```js
const { waitFor } = require('timeable-promise');
// Long process running...
let inflight = true
const predicate = () => !inflight;
const timeout = 5000;
setTimeout(() => {
  // Long process done.
  inflight = false;
}, 1000);
console.time('waitFor');
await waitFor(predicate, timeout);
console.timeEnd('waitFor');
```

Development Dependencies
-
You will need to install [Node.js](https://bit.ly/2SMCGXK) as a local
development dependency. The `npm` package manager comes bundled with all
recent releases of `Node.js`. You can also use [yarn](https://bit.ly/3nmWS1K)
as a package manager.

`yarn` or `npm install` will attempt to resolve any `npm` module dependencies
that have been declared in the project’s `package.json` file, installing them
into the `node_modules` folder.

```bash
$ yarn
# or
$ npm install
```

Run Benchmark, Leak, Lint, and Unit Tests
-
To make sure we did not break anything, let's run all the tests:

```bash
$ yarn test
# or
$ npm run test:lint; npm run test:unit; npm run test:bench; npm run test:leak
```

Run benchmark tests only:

```bash
$ yarn test:bench
# or
$ npm run test:bench
```

Run leak tests only:

```bash
$ yarn test:leak
# or
$ npm run test:leak
```

Run lint tests only:

```bash
$ yarn test:lint
# or
$ npm run test:lint
```

Run unit tests only:

```bash
$ yarn test:unit
# or
$ npm run test:unit
```

Contributing
-
If you would like to contribute code to Timeable Promise repository you can do so
through GitHub by forking the repository and sending a pull request.

If you do not agree to [Contribution Agreement](CONTRIBUTING.md), do not
contribute any code to Timeable Promise repository.

When submitting code, please make every effort to follow existing conventions
and style in order to keep the code as readable as possible. Please also include
appropriate test cases.

That's it! Thank you for your contribution!

License
-
Copyright (c) 2018 - 2023 Richard Huang.

This module is free software, licensed under: [GNU Affero General Public License (AGPL-3.0)](https://bit.ly/2yi7gyO).

Documentation and other similar content are provided under [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://bit.ly/2SMCRlS).
