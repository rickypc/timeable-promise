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
 * yarn add timeable-promise || npm install --save timeable-promise
 * ```
 *
 * ## API Call Graph
 *
 * The diagram below shows how the exported utilities interact with each other:
 *
 * ```mermaid
 * graph LR
 *
 * %% --- Subgraphs ---
 * subgraph Core
 *   append["📎 append"]
 *   outcome["🎯 outcome"]
 *   toNumber["🔢 toNumber"]
 * end
 *
 * subgraph Concurrency
 *   concurrent["⚡ concurrent"]
 *   concurrents["⚡⚡ concurrents"]
 *   parallel["🔀 parallel"]
 * end
 *
 * subgraph Sequencing
 *   consecutive["➡️ consecutive"]
 *   consecutives["➡️➡️ consecutives"]
 *   sequential["⏩ sequential"]
 * end
 *
 * poll["⏱️ poll"]
 * sleep["💤 sleep"]
 * waitFor["⏳ waitFor"]
 * untilSettledOrTimedOut["⏰ untilSettledOrTimedOut"]
 *
 * %% --- Links ---
 * chunk["📦 chunk"] --> toNumber
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
 *
 * %% --- Styling with original fills + black text ---
 * classDef core fill:#f9f,stroke:#333,stroke-width:2px,color:#000;
 * classDef concurrency fill:#bbf,stroke:#333,stroke-width:2px,color:#000;
 * classDef sequencing fill:#bfb,stroke:#333,stroke-width:2px,color:#000;
 * classDef utility fill:#ffd,stroke:#333,stroke-width:2px,color:#000;
 *
 * class append,outcome,toNumber core;
 * class concurrent,concurrents,parallel concurrency;
 * class consecutive,consecutives,sequential sequencing;
 * class poll,sleep,waitFor,untilSettledOrTimedOut,chunk utility;
 * ```
 */
export { default as append } from './append';
export { default as chunk } from './chunk';
export { default as concurrent } from './concurrent';
export { default as concurrents } from './concurrents';
export { default as consecutive } from './consecutive';
export { default as consecutives } from './consecutives';
export { type ArrayExecutor, default as outcome, type Settled } from './outcome';
export { default as parallel } from './parallel';
export { default as poll, type PollExecutor, type PollHandle } from './poll';
export { default as sequential } from './sequential';
export { default as sleep } from './sleep';
export { default as toNumber } from './toNumber';
export { type PromiseExecutor, type TimeoutExecutor, default as untilSettledOrTimedOut } from './untilSettledOrTimedOut';
export { default as waitFor } from './waitFor';
