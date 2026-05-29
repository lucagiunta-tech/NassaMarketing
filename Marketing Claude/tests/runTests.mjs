import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const tmpRoot = path.join(root, ".test-tmp");

const results = [];

function test(name, fn) {
  results.push({ name, fn });
}

function walk(dir, predicate = () => true, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".test-tmp" || entry.name === "node_modules") continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, predicate, acc);
    else if (predicate(p)) acc.push(p);
  }
  return acc;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function hasExtension(spec) {
  return /\.[a-z0-9]+$/i.test(spec);
}

function resolveLocalImport(fromFile, spec) {
  const base = path.resolve(path.dirname(fromFile), spec);
  const candidates = hasExtension(spec)
    ? [base]
    : [base, `${base}.js`, `${base}.jsx`, path.join(base, "index.js"), path.join(base, "index.jsx")];
  return candidates.find(candidate => fs.existsSync(candidate));
}

function rewriteLocalImportsForNode(source, filePath) {
  return source.replace(/(from\s+["'])(\.{1,2}\/[^"']+)(["'])/g, (match, prefix, spec, suffix) => {
    if (hasExtension(spec)) return match;
    const resolved = resolveLocalImport(filePath, spec);
    if (!resolved) return match;
    if (resolved.endsWith("index.js")) return `${prefix}${spec}/index.js${suffix}`;
    if (resolved.endsWith("index.jsx")) return `${prefix}${spec}/index.jsx${suffix}`;
    if (resolved.endsWith(".jsx")) return `${prefix}${spec}.jsx${suffix}`;
    return `${prefix}${spec}.js${suffix}`;
  });
}

function prepareTmpModules() {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  ensureDir(tmpRoot);
  const jsFiles = walk(root, p => p.endsWith(".js"));
  for (const src of jsFiles) {
    const rel = path.relative(root, src);
    const dest = path.join(tmpRoot, rel);
    ensureDir(path.dirname(dest));
    const source = fs.readFileSync(src, "utf8");
    fs.writeFileSync(dest, rewriteLocalImportsForNode(source, src));
  }
  fs.writeFileSync(path.join(tmpRoot, "package.json"), JSON.stringify({ type: "module" }, null, 2));
}

async function importTmp(relPath) {
  return import(pathToFileURL(path.join(tmpRoot, relPath)).href + `?t=${Date.now()}-${Math.random()}`);
}

function createMemoryStorage() {
  const store = new Map();
  return {
    getItem(key) { return store.has(key) ? store.get(key) : null; },
    setItem(key, value) { store.set(key, String(value)); },
    removeItem(key) { store.delete(key); },
    clear() { store.clear(); },
  };
}

function listLocalImportProblems() {
  const files = walk(root, p => /\.(js|jsx)$/.test(p));
  const problems = [];
  const importRegex = /(?:from\s+["']|import\s*["'])(\.{1,2}\/[^"']+)["']/g;
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    let match;
    while ((match = importRegex.exec(source))) {
      const spec = match[1];
      if (!resolveLocalImport(file, spec)) {
        problems.push(`${path.relative(root, file)} -> ${spec}`);
      }
    }
  }
  return problems;
}

prepareTmpModules();

const editorialModel = await importTmp("modules/editorial/editorialModel.js");
const postValidation = await importTmp("modules/editorial/postValidation.js");
const templateUtils = await importTmp("templates/templateUtils.js");
const exportService = await importTmp("services/exportService.js");

test("local imports resolve", () => {
  assert.deepEqual(listLocalImportProblems(), []);
});

test("postValidation normalizes type/status/channel", () => {
  assert.equal(postValidation.normalizePostType("carosello"), "carousel");
  assert.equal(postValidation.normalizePostType("story"), "storia");
  assert.equal(postValidation.normalizeFeedStatus("live"), "pubblicato");
  assert.deepEqual(postValidation.normalizePostPlatforms({ canale: "LinkedIn" }), ["linkedin"]);
});

test("postValidation blocks invalid post and allows valid post", () => {
  const invalid = postValidation.validatePostFormItem({
    titolo: "",
    caption: "",
    tipo: "video-strano",
    stato: "schedulato",
    piattaforme: [],
    data: "12/06/2026",
    time: "27:90",
    ctaLink: "www.example.com",
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.length >= 4);

  const valid = postValidation.validatePostFormItem({
    titolo: "Post valido",
    caption: "Caption valida",
    tipo: "post",
    stato: "schedulato",
    piattaforme: ["instagram"],
    data: "2026-06-12",
    time: "10:30",
    ctaLink: "https://example.com",
    linkAsset: "https://figma.com/file/demo",
  });
  assert.equal(valid.isValid, true);
  assert.deepEqual(valid.errors, []);
});

test("editorialModel keeps channel colors and status aliases stable", () => {
  assert.equal(editorialModel.getChannelColor("LinkedIn"), "#0A66C2");
  assert.equal(editorialModel.getChannelColor("linkedin"), "#0A66C2");
  assert.equal(editorialModel.normalizeFeedStatus("semaforo"), "revisione");
  assert.equal(editorialModel.isPostPublished({ stato: "live" }), true);
});

test("editorialModel merges feedItems and legacy contentItems without duplicates", () => {
  const project = {
    ed: {
      feedItems: [{ id: "a", titolo: "Nuovo", stato: "pubblicato", piattaforme: ["instagram"] }],
      contentItems: [
        { id: "b", title: "Legacy utile", status: "live", canale: "LinkedIn", dueDate: "2026-06-01" },
        { id: "a", title: "Duplicato legacy", status: "idea", canale: "Facebook" },
      ],
    },
  };
  const posts = editorialModel.getEditorialPosts(project);
  assert.equal(posts.length, 2);
  assert.equal(posts.find(p => p.id === "b").titolo, "Legacy utile");
  assert.equal(posts.find(p => p.id === "b").stato, "pubblicato");
  assert.deepEqual(posts.find(p => p.id === "b").piattaforme, ["linkedin"]);
});

test("editorialModel migrates workspace to schemaVersion 2", () => {
  const migrated = editorialModel.migrateWorkspaceData({
    projects: [{ id: "p1", ed: { contentItems: [{ id: "c1", title: "Legacy" }] } }],
    clients: [{ id: "client1" }],
  });
  assert.equal(migrated.schemaVersion, 2);
  assert.equal(migrated.projects[0].ed.feedItems.length, 1);
  assert.equal(migrated.projects[0].ed.feedItems[0].migratedFrom, "contentItems");
});

test("storageService saves and loads through localStorage fallback", async () => {
  global.window = { localStorage: createMemoryStorage() };
  const storageService = await importTmp("services/storageService.js");
  const saveResult = await storageService.safeSaveWorkspace({
    projects: [{ id: "p1", ed: { contentItems: [{ id: "legacy", title: "Legacy" }] } }],
    clients: [],
  }, "test-workspace");
  assert.equal(saveResult.ok, true);
  assert.equal(saveResult.data.schemaVersion, 2);

  const loadResult = await storageService.safeLoadWorkspace("test-workspace");
  assert.equal(loadResult.ok, true);
  assert.equal(loadResult.data.projects[0].ed.feedItems[0].id, "legacy");
  delete global.window;
});

test("storageService returns structured error when storage is missing", async () => {
  delete global.window;
  const storageService = await importTmp("services/storageService.js");
  const originalConsoleError = console.error;
  console.error = () => {};
  try {
    const result = await storageService.safeLoadWorkspace("missing-storage");
    assert.equal(result.ok, false);
    assert.match(result.error, /Storage non disponibile/);
  } finally {
    console.error = originalConsoleError;
  }
});

test("templateUtils buildCtx includes only available fields", () => {
  const ctx = templateUtils.buildCtx({ nome: "Cliente Demo", settore: "Retail", target: "Famiglie" });
  assert.match(ctx, /AZIENDA: Cliente Demo/);
  assert.match(ctx, /SETTORE: Retail/);
  assert.match(ctx, /TARGET: Famiglie/);
  assert.doesNotMatch(ctx, /BUDGET MARKETING/);
});

test("exportService renders markdown and document HTML", () => {
  const html = exportService.mdToHtml("# Titolo\n\n**Dato** importante");
  assert.match(html, /<h1>Titolo<\/h1>/);
  assert.match(html, /<strong>Dato<\/strong>/);

  const doc = exportService.buildDocHTML("Executive Summary", "# Titolo", "Cliente Demo");
  assert.match(doc, /Executive Summary/);
  assert.match(doc, /Cliente Demo/);
  assert.match(doc, /Nassa Marketing Studio/);
});

let passed = 0;
for (const item of results) {
  try {
    await item.fn();
    passed += 1;
    console.log(`ok ${passed} - ${item.name}`);
  } catch (error) {
    console.error(`not ok - ${item.name}`);
    console.error(error?.stack || error);
    fs.rmSync(tmpRoot, { recursive: true, force: true });
    process.exit(1);
  }
}
fs.rmSync(tmpRoot, { recursive: true, force: true });
console.log(`\nAll tests passed: ${passed}/${results.length}`);
