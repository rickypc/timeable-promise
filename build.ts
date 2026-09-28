/**
 * @copyright Copyright © 2018 Richard Huang <rickypc@users.noreply.github.com>
 * @description Bun build settings.
 * @file build.ts
 * @license AGPL-3.0-or-later
 */

import { mkdir, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { removeTypes } from 'remove-types';

const base = import.meta.dir;
const builds = [
  { format: 'esm', naming: '[name].js' },
  { format: 'cjs', naming: '[name].cjs' },
] as const;
// All entries.
const entry: Record<string, string> = {};
const example = { js: 'example.js', ts: 'example.ts' };
const path = `${base}/dist`;
const src = `${base}/src`;

// Ensure dist exists.
await mkdir(path, { recursive: true });

for (const file of await readdir(src)) {
  if (file.endsWith('.ts') && file !== example.ts) {
    entry[basename(file, '.ts')] = join(src, file);
  }
}

// Bundle ESM (.js) and CJS (.cjs) builds.
const results = await Promise.all(
  builds.map((build) =>
    Bun.build({
      entrypoints: Object.values(entry),
      format: build.format,
      minify: true,
      naming: { entry: build.naming },
      outdir: path,
      splitting: false,
      target: 'node',
    }).then((result) => ({ format: build.format, result })),
  ),
);
const failed = results.filter(({ result }) => !result.success);
if (failed.length) {
  const formats = failed.map(({ format }) => format).join(' & ');
  const logs = failed.flatMap(({ result }) => result.logs);
  throw new AggregateError(logs, `bundle execution failed for: ${formats}`);
}

// Generate type declarations.
const tsc = Bun.spawn([process.execPath, 'run', 'tsc', '-p', join(base, 'tsconfig.build.json')], {
  cwd: base,
  stderr: 'inherit',
  stdout: 'inherit',
});
const exitCode = await tsc.exited;
if (exitCode !== 0) {
  throw new Error(`tsc exited with code ${exitCode}`);
}

// Transpile example.ts.
await Bun.write(
  join(path, example.js),
  (await removeTypes(await Bun.file(join(src, example.ts)).text(), { trailingComma: 'all' }))
    .split('\n')
    .join('\n')
    .replace(" || process.env.NODE_ENV === 'spawn'", '')
    .replaceAll(example.ts, example.js),
);

// Copy files over.
await Promise.all(
  ['LICENSE', 'README.md'].map((file) => Bun.write(join(path, file), Bun.file(join(base, file)))),
);

// Generate package.json.
const {
  allowScripts,
  devDependencies,
  imports,
  overrides,
  scripts,
  trustedDependencies,
  ...pkg
} = await Bun.file(join(base, 'package.json')).json();
pkg.exports = {};
for (const name of Object.keys(entry)) {
  const key = name === 'index' ? '.' : `./${name}`;
  pkg.exports[key] = { import: `./${name}.js`, require: `./${name}.cjs`, types: `./${name}.d.ts` };
}
pkg.exports = Object.fromEntries(Object.entries(pkg.exports).sort(([a], [b]) => (a < b ? -1 : 1)));
pkg.main = 'index.cjs';
pkg.module = 'index.js';
pkg.runkitExampleFilename = example.js;
pkg.types = 'index.d.ts';
await Bun.write(
  join(path, 'package.json'),
  JSON.stringify(
    Object.keys(pkg)
      .sort()
      .reduce<Record<string, any>>((acc, key) => {
        acc[key] = pkg[key];
        return acc;
      }, {}),
    null,
    2,
  ),
);
