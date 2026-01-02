/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description Typedoc settings.
 * @file typedoc.config.js
 * @license AGPL-3.0-or-later
 */

// import { type Application, Configuration, type TypeDocOptions } from 'typedoc';
import { Configuration } from 'typedoc';
// import { type MarkdownRenderer } from 'typedoc-plugin-markdown';

/*
type MarkdownOptions = {
  $schema: string;
  enumMembersFormat: 'list' | 'table';
  expandObjects: boolean;
  hidePageHeader: boolean;
  indexFormat: 'group' | 'list' | 'table';
  outputFileStrategy: 'members' | 'modules' | 'none';
  parametersFormat: 'list' | 'table';
  propertiesFormat: 'list' | 'table';
  typeDeclarationFormat: 'list' | 'table';
  useCodeBlocks: boolean;
};

type TypeDocConfig = Partial<Omit<TypeDocOptions, 'plugin'>> & {
  // eslint-disable-next-line no-unused-vars
  plugin: (string | ((app: Application) => void))[];
} & MarkdownOptions;
*/

const plugins = {
  'typedoc-plugin-markdown': 'typedoc-plugin-markdown',
  // 'typedoc-plugin-markdown-index-end': (app: Application) => {
  'typedoc-plugin-markdown-index-end': /** @param {import('typedoc').Application} app - Application */(app) => {
    // (app.renderer as MarkdownRenderer).markdownHooks.on('index.page.end', () => `
    app.renderer.markdownHooks.on('index.page.end', () => `
## Development Dependencies

You will need to install [Node.js](https://nodejs.org/en/) as a local
development dependency. The \`npm\` package manager comes bundled with all
recent releases of \`Node.js\`. You can also use [yarn](https://yarnpkg.com)
as a package manager.

\`yarn\` or \`npm install\` will attempt to resolve any \`npm\` module dependencies
that have been declared in the project's \`package.json\` file, installing them
into the \`node_modules\` folder.

\`\`\`bash
yarn || npm install
\`\`\`

Run Leak, Lint, Performance, Type and Unit Tests
-
To make sure we did not break anything, let's run all the tests:

\`\`\`bash
yarn test || npm run test
\`\`\`

Run leak tests only:

\`\`\`bash
yarn test:leak || npm run test:leak
\`\`\`

Run linter only:

\`\`\`bash
yarn test:lint || npm run test:lint
\`\`\`

Run performance tests only:

\`\`\`bash
yarn test:perf || npm run test:perf
\`\`\`

Run type check only:

\`\`\`bash
yarn test:type || npm run test:type
\`\`\`

Run unit tests only:

\`\`\`bash
yarn test:unit || npm run test:unit
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

Copyright © 2018 Richard Huang.

This module is free software, licensed under:
[GNU Affero General Public License (AGPL-3.0)](https://www.gnu.org/licenses/agpl-3.0.en.html).

Documentation and other similar content are provided under
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).
    `);
  },
};

/** @type {import('typedoc').TypeDocOptions} */
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
// } satisfies TypeDocConfig;
