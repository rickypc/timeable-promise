[![Version](https://img.shields.io/npm/v/timeable-promise.svg)](https://bit.ly/2YFweqU)
[![Downloads](https://img.shields.io/npm/dt/timeable-promise.svg)](https://bit.ly/2YFweqU)
[![Dependency Status](https://img.shields.io/david/rickypc/timeable-promise.svg)](https://bit.ly/2KhJo3N)
[![Dev Dependency Status](https://img.shields.io/david/dev/rickypc/timeable-promise.svg)](https://bit.ly/2MuKEU3)
[![Code Style](https://img.shields.io/badge/code%20style-Airbnb-red.svg)](https://bit.ly/2JYN1gk)
[![Build](https://img.shields.io/travis/rickypc/timeable-promise.svg)](https://bit.ly/2ZlJrSv)
[![Coverage](https://img.shields.io/codecov/c/github/rickypc/timeable-promise.svg)](https://bit.ly/2LPRiVj)
[![License](https://img.shields.io/npm/l/timeable-promise.svg)](https://bit.ly/2yi7gyO)

Timeable Promise
================

A [Promise](https://mzl.la/2Yt4ykQ) object of an asynchronous operation with timeout support.

Installation
-

```bash
$ npm install --save timeable-promise
```

API Reference
-
**Example**  
```js
const { untilSettledOrTimedOut } = require('timeable-promise');
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
```

* [timeable-promise](#module_timeable-promise)
    * _static_
        * [.untilSettledOrTimedOut(executor, timeoutExecutor, timeout)](#module_timeable-promise.untilSettledOrTimedOut) ⇒ <code>Promise.&lt;\*&gt;</code>
    * _inner_
        * [~Executor](#module_timeable-promise..Executor) : <code>function</code>
        * [~TimeoutExecutor](#module_timeable-promise..TimeoutExecutor) : <code>function</code>

<a name="module_timeable-promise.untilSettledOrTimedOut"></a>

### timeable-promise.untilSettledOrTimedOut(executor, timeoutExecutor, timeout) ⇒ <code>Promise.&lt;\*&gt;</code>
Provide timeout support on Promise object.

**Kind**: static method of [<code>timeable-promise</code>](#module_timeable-promise)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - Resolve or reject response value.  

| Param | Type | Description |
| --- | --- | --- |
| executor | <code>Executor</code> | Executor function. |
| timeoutExecutor | <code>TimeoutExecutor</code> | Timeout executor function. |
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
<a name="module_timeable-promise..Executor"></a>

### timeable-promise~Executor : <code>function</code>
Executor function that is executed immediately by the Promise implementation.

**Kind**: inner typedef of [<code>timeable-promise</code>](#module_timeable-promise)  

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
<a name="module_timeable-promise..TimeoutExecutor"></a>

### timeable-promise~TimeoutExecutor : <code>function</code>
Timeout executor function that is executed when timeout is reached.

**Kind**: inner typedef of [<code>timeable-promise</code>](#module_timeable-promise)  

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

Development Dependencies
-
You will need to install [Node.js](https://bit.ly/2SMCGXK) as a local development dependency. The `npm` package manager comes bundled with all recent releases of `Node.js`.

`npm install` will attempt to resolve any `npm` module dependencies that have been declared in the project’s `package.json` file, installing them into the `node_modules` folder.

```bash
$ npm install
```

Run Linter
-
To make sure we followed code style best practice, run:

```bash
$ npm run lint
```

Run Unit Tests
-
To make sure we did not break anything, let's run:

```bash
$ npm test
```

Contributing
-
If you would like to contribute code to Timeable Promise project you can do so through GitHub by forking the repository and sending a pull request.

When submitting code, please make every effort to follow existing conventions and style in order to keep the code as readable as possible. Please also include appropriate test cases.

Before your code can be accepted into the project you must also sign the [Timeable Promise CLA](https://bit.ly/2GCEiOy) (Individual Contributor License Agreement).

That's it! Thank you for your contribution!

License
-
Copyright (c) 2018 - 2019 Richard Huang.

This plugin is free software, licensed under: [GNU Affero General Public License (AGPL-3.0)](https://bit.ly/2yi7gyO).

Documentation and other similar content are provided under [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://bit.ly/2SMCRlS).
