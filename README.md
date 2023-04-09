[![Version](https://img.shields.io/npm/v/timeable-promise)](https://bit.ly/2YFweqU)
[![Downloads](https://img.shields.io/npm/dt/timeable-promise)](https://bit.ly/2YFweqU)
<!---
[![Dependency Status](https://img.shields.io/david/rickypc/timeable-promise)](https://bit.ly/2KhJo3N)
[![Dev Dependency Status](https://img.shields.io/david/dev/rickypc/timeable-promise)](https://bit.ly/2MuKEU3)
-->
[![Code Style](https://img.shields.io/badge/code%20style-Airbnb-red)](https://bit.ly/2JYN1gk)
[![Build](https://img.shields.io/github/actions/workflow/status/rickypc/timeable-promise/validations.yml)](https://bit.ly/43aA0qF)
[![Coverage](https://img.shields.io/codecov/c/github/rickypc/timeable-promise)](https://bit.ly/2LPRiVj)
[![Vulnerability](https://img.shields.io/snyk/vulnerabilities/github/rickypc/timeable-promise)](https://bit.ly/2yP3kGa)
<!---
[![Dependabot](https://api.dependabot.com/badges/status?host=github&repo=rickypc/timeable-promise)](https://bit.ly/2KIM5vs)
-->
[![License](https://img.shields.io/npm/l/timeable-promise)](https://bit.ly/2yi7gyO)

Timeable Promise
================

A [Promise](https://mzl.la/2MQJhPC) object of an asynchronous operation with timeout support.

Installation
-

```bash
$ yarn add timeable-promise
# or
$ npm install --save timeable-promise
```

API Reference
-
A Promise object of an asynchronous operation with timeout support.

**See**: [Promise](https://mzl.la/2MQJhPC)  
**Example**  
```js
const { untilSettledOrTimedOut, waitFor } = require('timeable-promise');
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
    * [.untilSettledOrTimedOut(executor, timeoutExecutor, timeout)](#module_timeable-promise.untilSettledOrTimedOut) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.waitFor(predicate, timeout, [interval])](#module_timeable-promise.waitFor) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="module_timeable-promise.untilSettledOrTimedOut"></a>

### timeable-promise.untilSettledOrTimedOut(executor, timeoutExecutor, timeout) ⇒ <code>Promise.&lt;\*&gt;</code>
Provide timeout support on Promise object.

**Kind**: static method of [<code>timeable-promise</code>](#module_timeable-promise)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - Resolve or reject response value.  

| Param | Type | Description |
| --- | --- | --- |
| executor | [<code>Executor</code>](#Executor) | Executor function. |
| timeoutExecutor | [<code>TimeoutExecutor</code>](#TimeoutExecutor) | Timeout executor function. |
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
<a name="module_timeable-promise.waitFor"></a>

### timeable-promise.waitFor(predicate, timeout, [interval]) ⇒ <code>Promise.&lt;void&gt;</code>
Provide waiting support on given predicate.

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
