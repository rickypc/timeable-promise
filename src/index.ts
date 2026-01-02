/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description Entry point of the library, re-exporting all public types and functions.
 * @file index.ts
 * @license AGPL-3.0-or-later
 */

/**
 * @packageDocumentation
 *
 * [![Version](https://img.shields.io/npm/v/timeable-promise?logo=npm)](https://www.npmjs.com/package/timeable-promise)
 * [![Downloads](https://img.shields.io/npm/dt/timeable-promise)](https://www.npmjs.com/package/timeable-promise)
 * [![Dependencies](https://img.shields.io/librariesio/github/rickypc/timeable-promise?logo=librariesdotio)](https://libraries.io/npm/timeable-promise)
 * [![Style](https://img.shields.io/badge/style-Airbnb-red?logo=eslint)](https://github.com/airbnb/javascript)
 * ![TypeScript](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/rickypc/timeable-promise/main/package.json&query=$.devDependencies.typescript&label=typescript&logo=typescript&logoColor=fff&color=3178C6)
 * [![Checks](https://img.shields.io/github/actions/workflow/status/rickypc/timeable-promise/validations.yml?logo=githubactions&label=checks)](https://github.com/rickypc/timeable-promise/actions/workflows/validations.yml)
 * [![Coverage](https://img.shields.io/codecov/c/github/rickypc/timeable-promise?logo=codecov)](https://app.codecov.io/gh/rickypc/timeable-promise)
 * [![Vulnerabilities](https://snyk.io/test/github/rickypc/timeable-promise/badge.svg)](https://snyk.io/test/github/rickypc/timeable-promise?tab=dependencies)
 * [![License](https://img.shields.io/npm/l/timeable-promise?logo=opensourceinitiative)](https://www.gnu.org/licenses/agpl-3.0.en.html)
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
 * ## Importing
 *
 * This package supports two styles of import:
 *
 * 1. Named exports from the entry point:
 * ```ts
 * import { chunk, ..., waitFor } from 'timeable-promise';
 * ```
 *
 * 2. Direct path imports for individual utilities:
 * ```ts
 * import chunk from 'timeable-promise/chunk';
 * ```
 *
 * Use whichever style fits your project. Named exports are convenient when you
 * need several utilities at once, while direct path imports can reduce bundle
 * size if you only need one.
 *
 * > This package is written in TypeScript and provides type definitions
 * > out of the box. Your editor will offer autocomplete and type safety
 * > automatically.
 *
 * For the full list of exports, refer to the [API Call Graph](#api-call-graph).
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
export { type ItemExecutor, default as outcome, type Settled } from './outcome';
export { default as parallel } from './parallel';
export { default as poll, type PollExecutor, type PollHandle } from './poll';
export { default as sequential } from './sequential';
export { default as sleep } from './sleep';
export { default as toNumber } from './toNumber';
export {
  type PromiseConstructor,
  type PromiseExecutor,
  type TimeoutExecutor,
  default as untilSettledOrTimedOut,
} from './untilSettledOrTimedOut';
export { default as waitFor } from './waitFor';
