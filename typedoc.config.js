/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Typedoc settings.
 * @file typedoc.config.js
 * @license AGPL-3.0-or-later
 */

import { Configuration } from 'typedoc';

const plugins = {
  'typedoc-plugin-markdown': 'typedoc-plugin-markdown',
  'typedoc-plugin-markdown-index-end': (app) => {
    app.renderer.markdownHooks.on('index.page.end', () => `
## Development Dependencies

You will need to install [Node.js](https://bit.ly/2SMCGXK) as a local
development dependency. The \`npm\` package manager comes bundled with all
recent releases of \`Node.js\`. You can also use [yarn](https://bit.ly/3nmWS1K)
as a package manager.

\`yarn\` or \`npm install\` will attempt to resolve any \`npm\` module dependencies
that have been declared in the project's \`package.json\` file, installing them
into the \`node_modules\` folder.

\`\`\`bash
$ yarn
# or
$ npm install
\`\`\`

Run Performance, Leak, Lint, and Unit Tests
-
To make sure we did not break anything, let's run all the tests:

\`\`\`bash
$ yarn test
# or
$ npm run test: lint; npm run test: unit; npm run test: perf; npm run test: leak
\`\`\`

Run performance tests only:

\`\`\`bash
$ yarn test: perf
# or
$ npm run test: perf
\`\`\`

Run leak tests only:

\`\`\`bash
$ yarn test: leak
# or
$ npm run test: leak
\`\`\`

Run linter only:

\`\`\`bash
$ yarn test: lint
# or
$ npm run test: lint
\`\`\`

Run unit tests only:

\`\`\`bash
$ yarn test: unit
# or
$ npm run test: unit
\`\`\`

## Contributing

If you would like to contribute code to Timeable Promise repository you can do so
through GitHub by forking the repository and sending a pull request.

If you do not agree to [Contribution Agreement](CONTRIBUTING.md), do not
contribute any code to Timeable Promise repository.

When submitting code, please make every effort to follow existing conventions
and style in order to keep the code as readable as possible. Please also include
appropriate test cases.

That's it! Thank you for your contribution!

## License

Copyright (c) 2018-${new Date().getFullYear()} Richard Huang.

This module is free software, licensed under:
[GNU Affero General Public License (AGPL-3.0)](https://bit.ly/2yi7gyO).

Documentation and other similar content are provided under
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://bit.ly/2SMCRlS).
    `);
  },
};

export default {
  $schema: 'https://typedoc-plugin-markdown.org/schema.json',
  blockTags: [
    ...Configuration.OptionDefaults.blockTags,
    '@copyright',
    '@description',
    '@file',
  ],
  // ⚠️ Danger: Cleaning the output directory will erase the repository.
  cleanOutputDir: false,
  entryPoints: ['src/index.ts'],
  enumMembersFormat: 'table',
  expandObjects: true,
  gitRevision: 'main',
  groupOrder: ['Functions', '*'],
  hidePageHeader: true,
  indexFormat: 'table',
  name: 'Timeable Promise',
  // ⚠️ Output directory is the repository root.
  out: '',
  outputFileStrategy: 'modules',
  parametersFormat: 'table',
  plugin: Object.values(plugins),
  propertiesFormat: 'table',
  readme: 'none',
  typeDeclarationFormat: 'table',
  useCodeBlocks: true,
};
