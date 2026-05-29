const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '..');
const cache = new Map();

function resolveModule(fromFile, spec) {
  if (!spec.startsWith('.')) return require.resolve(spec, { paths: [path.dirname(fromFile)] });
  const base = path.resolve(path.dirname(fromFile), spec);
  const candidates = [base, `${base}.js`, `${base}.jsx`, path.join(base, 'index.js'), path.join(base, 'index.jsx')];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  throw new Error(`Cannot resolve ${spec} from ${fromFile}`);
}

function loadModule(relPath) {
  const absPath = path.resolve(ROOT, relPath);
  return loadAbs(absPath);
}

function loadAbs(absPath) {
  absPath = path.normalize(absPath);
  if (cache.has(absPath)) return cache.get(absPath).exports;

  const source = fs.readFileSync(absPath, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
    },
    fileName: absPath,
  }).outputText;

  const module = { exports: {} };
  cache.set(absPath, module);

  function localRequire(spec) {
    if (spec === 'react') {
      return {
        __esModule: true,
        default: {},
        useState: () => [undefined, () => {}],
        useEffect: () => {},
        useMemo: fn => fn(),
        useRef: () => ({ current: null }),
        useCallback: fn => fn,
      };
    }
    if (spec.startsWith('.')) return loadAbs(resolveModule(absPath, spec));
    return require(spec);
  }

  const fn = new Function('require', 'exports', 'module', '__filename', '__dirname', compiled);
  fn(localRequire, module.exports, module, absPath, path.dirname(absPath));
  return module.exports;
}

const results = [];
function test(name, fn) { results.push({ name, fn }); }
function assert(condition, message = 'Assertion failed') { if (!condition) throw new Error(message); }
function assertEqual(actual, expected, message = 'Values are not equal') {
  if (actual !== expected) throw new Error(`${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}
function assertDeepEqual(actual, expected, message = 'Objects are not equal') {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(`${message}: expected ${e}, got ${a}`);
}
function assertIncludes(value, needle, message = 'Value does not include expected text') {
  if (!String(value).includes(needle)) throw new Error(`${message}: missing ${JSON.stringify(needle)} in ${JSON.stringify(value).slice(0, 240)}`);
}
async function withSuppressedConsoleError(fn) {
  const original = console.error;
  console.error = () => {};
  try { return await fn(); } finally { console.error = original; }
}

const editorial = loadModule('modules/editorial/editorialModel.js');
const validation = loadModule('modules/editorial/postValidation.js');
const storage = loadModule('services/storageService.js');
const ai = loadModule('services/aiService.js');
const exportService = loadModule('services/exportService.js');
const templateUtils = loadModule('templates/templateUtils.js');
const meta = loadModule('services/metaService.js');
const team = loadModule('modules/team/teamModel.js');
const editorialTheme = loadModule('modules/editorial/editorialTheme.js');
const markdown = loadModule('utils/markdown.js');
const formatters = loadModule('utils/formatters.js');

// editorialModel tests
test('editorialModel normalizes channel colors for lowercase and legacy uppercase', () => {
  assertEqual(editorial.getChannelColor('linkedin'), '#0A66C2');
  assertEqual(editorial.getChannelColor('LinkedIn'), '#0A66C2');
  assertEqual(editorial.getChannelColor('unknown'), '#64748B');
});

test('editorialModel normalizes legacy statuses', () => {
  assertEqual(editorial.normalizeFeedStatus('live'), 'pubblicato');
  assertEqual(editorial.normalizeFeedStatus('semaforo'), 'revisione');
  assertEqual(editorial.normalizeFeedStatus('non_approvato'), 'non-approvato');
  assertEqual(editorial.normalizeFeedStatus('not-a-status'), 'bozza');
});

test('editorialModel merges feedItems and legacy contentItems without duplicates', () => {
  const project = { ed: {
    feedItems: [{ id: 'p1', titolo: 'Modern', stato: 'live', piattaforme: ['LinkedIn'] }],
    contentItems: [
      { id: 'old1', title: 'Legacy', status: 'semaforo', canale: 'Instagram', dueDate: '2026-06-01' },
      { id: 'p1', title: 'Duplicate legacy', status: 'idea' },
    ],
  }};
  const posts = editorial.getEditorialPosts(project);
  assertEqual(posts.length, 2);
  assertEqual(posts[0].stato, 'pubblicato');
  assertEqual(posts[0].piattaforme[0], 'linkedin');
  assertEqual(posts[1].titolo, 'Legacy');
  assertEqual(posts[1].stato, 'revisione');
  assertEqual(posts[1]._legacySource, 'contentItems');
});

test('editorialModel migrates workspace data to schemaVersion 2 and feedItems', () => {
  const data = { schemaVersion: 1, clients: [{ id: 'c1' }], projects: [{ id: 'proj', ed: { contentItems: [{ id: 'old', title: 'Legacy post', status: 'live', canale: 'Facebook' }] } }] };
  const migrated = editorial.migrateWorkspaceData(data);
  assertEqual(migrated.schemaVersion, 2);
  assertEqual(migrated.clients.length, 1);
  assertEqual(migrated.projects[0].ed.feedItems.length, 1);
  assertEqual(migrated.projects[0].ed.feedItems[0].migratedFrom, 'contentItems');
  assertEqual(migrated.projects[0].ed.feedItems[0].stato, 'pubblicato');
});

test('editorialModel applyEdUpdate preserves normalized editorial shape', () => {
  const updated = editorial.applyEdUpdate({ id: 'p', ed: { feedItems: [] } }, ed => ({ ideas: [{ id: 'i1' }], feedItems: [...ed.feedItems, { id: 'f1' }] }));
  assert(Array.isArray(updated.ed.campagne));
  assert(Array.isArray(updated.ed.calendarEvents));
  assertEqual(updated.ed.ideas.length, 1);
  assertEqual(updated.ed.feedItems.length, 1);
});

// postValidation tests
test('postValidation accepts a valid post', () => {
  const result = validation.validatePostFormItem({
    titolo: 'Titolo',
    caption: 'Caption',
    tipo: 'post',
    stato: 'bozza',
    piattaforme: ['instagram'],
    data: '2026-06-12',
    time: '10:30',
    ctaLink: 'https://example.com',
    linkAsset: 'https://figma.com/file/demo',
  });
  assert(result.isValid);
  assertEqual(result.errors.length, 0);
});

test('postValidation blocks invalid date, time, URL and missing platform', () => {
  const result = validation.validatePostFormItem({
    titolo: '',
    caption: '',
    tipo: 'video-strano',
    stato: 'schedulato',
    piattaforme: [],
    data: '12/06/2026',
    time: '27:99',
    ctaLink: 'www.example.com',
  });
  assert(!result.isValid);
  assert(result.errors.length >= 6, 'Expected multiple validation errors');
});

test('postValidation warns for reel without video and CTA without link', () => {
  const result = validation.validatePostFormItem({ titolo: 'Reel', tipo: 'reel', stato: 'bozza', piattaforme: ['instagram'], cta: 'Scopri' });
  assert(result.isValid);
  assert(result.warnings.some(w => w.includes('URL video')));
  assert(result.warnings.some(w => w.includes('CTA')));
});

test('postValidation supports legacy type/status aliases', () => {
  assertEqual(validation.normalizePostType('carosello'), 'carousel');
  assertEqual(validation.normalizePostType('story'), 'storia');
  assertEqual(validation.normalizeFeedStatus('live'), 'pubblicato');
});

// storageService tests
test('storageService safeSaveWorkspace and safeLoadWorkspace use window.storage and migrate data', async () => {
  const previousWindow = global.window;
  const memory = new Map();
  global.window = {
    storage: {
      async get(key) { return memory.has(key) ? { value: memory.get(key) } : null; },
      async set(key, value) { memory.set(key, value); },
    },
  };
  try {
    const input = { projects: [{ id: 'p', ed: { contentItems: [{ id: 'old', title: 'Legacy' }] } }], clients: [] };
    const saved = await storage.safeSaveWorkspace(input, 'unit-key');
    assert(saved.ok, saved.error);
    assertEqual(saved.data.schemaVersion, 2);
    assert(memory.has('unit-key'));

    const loaded = await storage.safeLoadWorkspace('unit-key');
    assert(loaded.ok, loaded.error);
    assertEqual(loaded.data.projects[0].ed.feedItems.length, 1);
  } finally {
    global.window = previousWindow;
  }
});

test('storageService returns structured error when storage backend is unavailable', async () => {
  const previousWindow = global.window;
  delete global.window;
  try {
    const result = await withSuppressedConsoleError(() => storage.safeLoadWorkspace('unit-key'));
    assert(!result.ok);
    assertIncludes(result.error, 'Storage non disponibile');
  } finally {
    if (previousWindow !== undefined) global.window = previousWindow;
  }
});

// aiService tests
test('aiService callAiMessages returns joined text with fake fetch', async () => {
  const fakeFetch = async () => ({ ok: true, json: async () => ({ content: [{ text: 'Hello' }, { text: ' world' }] }) });
  const text = await ai.callAiMessages({ prompt: 'Say hello', fetchImpl: fakeFetch, retries: 1 });
  assertEqual(text, 'Hello world');
});

test('aiService safeCallClaude returns structured error with failing fetch', async () => {
  const fakeFetch = async () => ({ ok: false, status: 429, json: async () => ({ error: { message: 'Rate limit' } }) });
  const result = await withSuppressedConsoleError(() => ai.safeCallClaude('Prompt', 100, { fetchImpl: fakeFetch, retries: 1 }));
  assert(!result.ok);
  assertIncludes(result.error, 'Rate limit');
});

test('aiService rejects empty prompt', async () => {
  let failed = false;
  try {
    await ai.callAiMessages({ prompt: '', fetchImpl: async () => ({ ok: true, json: async () => ({}) }) });
  } catch (error) {
    failed = true;
    assertIncludes(error.message, 'Prompt AI vuoto');
  }
  assert(failed, 'Expected empty prompt to throw');
});

// exportService tests
test('exportService mdToHtml and buildDocHTML produce expected HTML', () => {
  const html = exportService.mdToHtml('## Titolo\n\n**Bold**');
  assertIncludes(html, '<h2>Titolo</h2>');
  assertIncludes(html, '<strong>Bold</strong>');
  const doc = exportService.buildDocHTML('Documento', '## Sezione', 'Progetto Demo');
  assertIncludes(doc, 'Documento');
  assertIncludes(doc, 'Progetto Demo');
});

test('exportService buildSlidePrompt includes section label and content', () => {
  const prompt = exportService.buildSlidePrompt('Executive Summary', 'Contenuto strategico');
  assertIncludes(prompt, 'Executive Summary');
  assertIncludes(prompt, 'Contenuto strategico');
});

test('exportService buildSlideshowHTML falls back on invalid slide JSON', () => {
  const html = exportService.buildSlideshowHTML('not json', 'Label', 'Project');
  assertIncludes(html, 'Label');
  assertIncludes(html, 'Contenuto non strutturato');
});

// templateUtils tests
test('templateUtils buildCtx includes provided fields and omits missing ones', () => {
  const ctx = templateUtils.buildCtx({ nome: 'Cliente', settore: 'Retail', obiettivo1: 'Aumentare lead' });
  assertIncludes(ctx, 'AZIENDA: Cliente');
  assertIncludes(ctx, 'SETTORE: Retail');
  assertIncludes(ctx, 'OBIETTIVO PRIMARIO: Aumentare lead');
  assert(!ctx.includes('undefined'));
});

test('templateUtils uid returns non-empty ids', () => {
  const id = templateUtils.uid();
  assert(typeof id === 'string' && id.length >= 5);
});

// metaService tests
test('metaService buildMetaOAuthUrl includes app id, encoded redirect and scopes', () => {
  const url = meta.buildMetaOAuthUrl({ appId: '123', redirectUri: 'https://example.com/callback', scopes: 'a,b' });
  assertIncludes(url, 'client_id=123');
  assertIncludes(url, 'redirect_uri=https%3A%2F%2Fexample.com%2Fcallback');
  assertIncludes(url, 'scope=a,b');
});

test('metaService serializeMetaError returns readable messages', () => {
  assertEqual(meta.serializeMetaError(new Error('Boom')), 'Boom');
  assertEqual(meta.serializeMetaError('String error'), 'String error');
});

// teamModel tests
test('teamModel date helpers format and add days correctly', () => {
  const d = new Date(2026, 0, 5);
  assertEqual(team.fmtISO(d), '2026-01-05');
  assertEqual(team.fmtShort(d), '05/01');
  assertEqual(team.fmtISO(team.addDays(d, 2)), '2026-01-07');
});

test('teamModel exposes default team members and roles', () => {
  assert(Array.isArray(team.DEFAULT_MEMBERS_NMS));
  assert(team.DEFAULT_MEMBERS_NMS.length >= 1);
  assert(team.DEFAULT_MEMBERS_NMS.every(member => member.id && member.nome && member.ruolo));
  assert(Array.isArray(team.RUOLI_NMS));
  assert(team.RUOLI_NMS.includes('Strategia'));
});


test('editorialTheme resolves shared pillar colors and project overrides', () => {
  assertEqual(editorialTheme.getPillarColor('Educational'), '#0EA5E9');
  assertEqual(editorialTheme.getPillarColor('Custom', { pilastri: [{ nome: 'Custom', colore: '#123456' }] }), '#123456');
  assertEqual(editorialTheme.getPillarColor('Missing'), '#94A3B8');
});

test('editorialTheme exposes shared idea status styles', () => {
  assertEqual(editorialTheme.getIdeaStatus('ready').label, 'Pronto');
  assertEqual(editorialTheme.getIdeaStatus('unknown').label, 'Bozza');
});

test('markdown utility renders safe headings, emphasis and escaped html', () => {
  const html = markdown.renderMarkdown('# Titolo\n\n**Bold** <script>bad</script>');
  assertIncludes(html, '<h1>Titolo</h1>');
  assertIncludes(html, '<strong>Bold</strong>');
  assertIncludes(html, '&lt;script&gt;bad&lt;/script&gt;');
});

test('formatters parse metrics and format deltas consistently', () => {
  assertEqual(formatters.parseMetric('12,5%'), 12.5);
  assertEqual(formatters.formatDelta(formatters.getDelta('15', '10'), '%'), '+5.0%');
  assertEqual(formatters.formatShortDate('2026-06-12'), '12 giu');
});

(async () => {
  let passed = 0;
  const failures = [];
  for (const t of results) {
    try {
      await t.fn();
      passed += 1;
      console.log(`ok ${passed} - ${t.name}`);
    } catch (error) {
      failures.push({ name: t.name, error });
      console.error(`not ok ${passed + failures.length} - ${t.name}`);
      console.error(error && error.stack ? error.stack : error);
    }
  }
  console.log(`\nUnit tests: ${passed}/${results.length} passed`);
  if (failures.length) process.exit(1);
})();
