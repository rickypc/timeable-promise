/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Entry point of the library, re-exporting all public types and functions.
 * @file index.ts
 * @license AGPL-3.0-or-later
 */

/**
 * @packageDocumentation
 *
 * [![Version](https://img.shields.io/npm/v/timeable-promise)](https://bit.ly/2YFweqU)
 * [![Downloads](https://img.shields.io/npm/dt/timeable-promise)](https://bit.ly/2YFweqU)
 * [![Dependency Status](https://img.shields.io/librariesio/github/rickypc/timeable-promise)](https://bit.ly/3MUJErG)
 * [![Code Style](https://img.shields.io/badge/code%20style-Airbnb-red)](https://bit.ly/2JYN1gk)
 * [![Build](https://img.shields.io/github/actions/workflow/status/rickypc/timeable-promise/validations.yml)](https://bit.ly/43aA0qF)
 * [![Coverage](https://img.shields.io/codecov/c/github/rickypc/timeable-promise)](https://bit.ly/2LPRiVj)
 * [![Vulnerability](https://img.shields.io/snyk/vulnerabilities/github/rickypc/timeable-promise)](https://bit.ly/2yP3kGa)
 * [![License](https://img.shields.io/npm/l/timeable-promise)](https://bit.ly/2yi7gyO)
 *
 * Collection of asynchronous utilities for managing concurrency,
 * sequencing, and timing. Provides helpers for running tasks in
 * parallel or sequential order, controlling execution with timeouts,
 * and working with settled promise results.
 *
 * ## Installation
 *
 * ```bash
 * $ yarn add timeable-promise
 * # or
 * $ npm install --save timeable-promise
 * ```
 *
 * ## API Call Graph
 *
 * The diagram below shows how the exported utilities interact with each other:
 *
 * ```mermaid
 * graph LR
 *
 * subgraph Core
 *   append
 *   outcome
 *   toNumber
 * end
 *
 * subgraph Concurrency
 *   concurrent
 *   concurrents
 *   parallel
 * end
 *
 * subgraph Sequencing
 *   consecutive
 *   consecutives
 *   sequential
 * end
 *
 * poll
 * sleep
 * waitFor
 * untilSettledOrTimedOut
 *
 * chunk --> toNumber
 * concurrent --> chunk
 *
 * concurrents --> concurrent
 * concurrents --> append
 * concurrents --> toNumber
 * concurrents --> outcome
 *
 * consecutive --> outcome
 * consecutive --> toNumber
 *
 * consecutives --> append
 * consecutives --> consecutive
 * consecutives --> toNumber
 * consecutives --> outcome
 *
 * parallel --> chunk
 * parallel --> concurrent
 * parallel --> concurrents
 * parallel --> toNumber
 * parallel --> outcome
 *
 * sequential --> chunk
 * sequential --> consecutive
 * sequential --> consecutives
 * sequential --> toNumber
 * sequential --> outcome
 *
 * waitFor --> untilSettledOrTimedOut
 * ```
 */
export * from './chunk';
export * from './concurrent';
export * from './concurrents';
export * from './consecutive';
export * from './consecutives';
export { type ArrayExecutor, type Settled } from './outcome';
export * from './parallel';
export * from './poll';
export * from './sequential';
export * from './sleep';
export * from './toNumber';
export * from './untilSettledOrTimedOut';
export * from './waitFor';
