const ts = require('typescript');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.test-tmp') continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (/\.(js|jsx)$/.test(entry.name)) acc.push(p);
  }
  return acc;
}

function resolveRelativeImport(fromFile, spec) {
  if (!spec.startsWith('.')) return true;
  const base = path.resolve(path.dirname(fromFile), spec);
  const candidates = [base, `${base}.js`, `${base}.jsx`, path.join(base, 'index.js'), path.join(base, 'index.jsx')];
  return candidates.some(p => fs.existsSync(p));
}

let diagnostics = 0;
const files = walk(__dirname).filter(file => !file.includes(`${path.sep}tests${path.sep}`));
for (const file of files) {
  const rel = path.relative(__dirname, file);
  const source = fs.readFileSync(file, 'utf8');
  const result = ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
    reportDiagnostics: true,
    fileName: rel,
  });
  const diags = result.diagnostics || [];
  if (diags.length) {
    console.log(`\n${rel}`);
    for (const d of diags) console.log(ts.flattenDiagnosticMessageText(d.messageText, '\n'));
  }
  diagnostics += diags.length;

  const importRegex = /(?:from\s+["']|import\s*["'])(\.{1,2}\/[^"']+)["']/g;
  let match;
  while ((match = importRegex.exec(source))) {
    if (!resolveRelativeImport(file, match[1])) {
      console.log(`Unresolved import in ${rel}: ${match[1]}`);
      diagnostics += 1;
    }
  }
}

console.log(`syntax/import diagnostics ${diagnostics}`);
if (diagnostics) process.exit(1);

const unit = spawnSync(process.execPath, [path.join(__dirname, 'tests', 'run_unit_tests.cjs')], { stdio: 'inherit' });
if (unit.status !== 0) process.exit(unit.status || 1);
console.log('Step 38 check OK - syntax/imports and unit tests passed.');
