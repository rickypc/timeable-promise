/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description RsPack settings.
 * @file rspack.config.js
 * @license AGPL-3.0-or-later
 */

import { basename, dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  writeFile,
} from 'node:fs/promises';
import { removeTypes } from 'remove-types';
import { TsCheckerRspackPlugin } from 'ts-checker-rspack-plugin';

type Export = [string, { import: string; require: string; types: string }];

const base = dirname(fileURLToPath(import.meta.url));
const example = { js: 'example.js', ts: 'example.ts' };
const path = join(base, 'dist');
const require = createRequire(import.meta.url);
const src = join(base, 'src');

// Shared config.
const config = {
  devtool: false,
  mode: 'production',
  module: { rules: [{ test: /\.ts$/, use: 'builtin:swc-loader' }] },
  output: { path },
  plugins: [new TsCheckerRspackPlugin({
    typescript: {
      configOverwrite: {
        compilerOptions: { rootDir: 'src' },
        exclude: ['*.config.ts', `src/${example.ts}`, 'tests'],
      },
      mode: 'write-dts',
    },
  })],
  resolve: { extensions: ['.ts'] },
};

// All entries.
const entry = Object.fromEntries((await readdir(src))
  .filter((file) => file.endsWith('.ts') && ![example.ts].includes(file))
  .map((file) => [basename(file, '.ts'), join(src, file)]));

// Ensure dist exists.
await mkdir(path, { recursive: true });

// Transpile example.ts.
// eslint-disable-next-line security/detect-non-literal-fs-filename
await writeFile(
  join(path, example.js),
  (await removeTypes(
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await readFile(join(src, example.ts), 'utf8'),
    { trailingComma: 'all' },
  ))
    .split('\n')
    .filter((line) => !(line.trim().endsWith('no-unused-vars')))
    .join('\n')
    .replace(example.ts, example.js),
);

// Copy files over.
await Promise.all(['LICENSE', 'README.md']
  .map((file) => copyFile(join(base, file), join(path, file))));

// Generate package.json.
// eslint-disable-next-line import/no-dynamic-require
const pkg = require(join(base, 'package.json'));
// eslint-disable-next-line security/detect-object-injection
['devDependencies', 'imports', 'scripts'].forEach((key) => delete pkg[key]);
pkg.exports = Object.fromEntries(
  Object.entries(entry)
    .map<Export>(([name]) => {
      const key = name === 'index' ? '.' : `./${name}`;
      return [
        key,
        { import: `./${name}.js`, require: `./${name}.cjs`, types: `./${name}.d.ts` },
      ];
    })
    .sort(([a], [b]) => a.localeCompare(b)),
);
pkg.main = 'index.cjs';
pkg.module = 'index.js';
pkg.runkitExampleFilename = example.js;
pkg.types = 'index.d.ts';
await writeFile(
  join(path, 'package.json'),
  JSON.stringify(Object.fromEntries(
    Object.entries(pkg).sort(([a], [b]) => a.localeCompare(b)),
  ), null, 2),
);

export default [
  // ESM build (.js)
  {
    ...config,
    entry,
    experiments: { outputModule: true },
    output: { ...config.output, filename: '[name].js', library: { type: 'module' } },
  },
  // CJS build (.cjs)
  {
    ...config,
    entry,
    output: { ...config.output, filename: '[name].cjs', library: { type: 'commonjs2' } },
  },
];
