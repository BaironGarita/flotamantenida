// Usar Sass en JavaScript evita depender del ejecutable nativo de Dart en Windows.
const { spawnSync } = require('node:child_process');
const result = spawnSync(
  process.execPath,
  [require.resolve('@angular/cli/bin/ng.js'), ...process.argv.slice(2)],
  { stdio: 'inherit', env: { ...process.env, NG_BUILD_SASS_EMBEDDED: 'false' } },
);
if (result.error) console.error(result.error.message);
process.exitCode = result.status ?? 1;
