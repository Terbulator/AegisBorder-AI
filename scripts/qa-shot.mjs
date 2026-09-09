/* Ponytail QA: drive headless Chrome via CDP, click through routes, full-page
   screenshots at desktop/tablet/mobile, collect console errors.
   Usage: node scripts/qa-shot.mjs [base-url] [out-dir] */
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9333;
const BASE = process.argv[2] || 'http://localhost:5173';
const OUT = process.argv[3] || 'qa';
mkdirSync(OUT, { recursive: true });

const profile = join('C:\\Users\\halda\\AppData\\Local\\Temp\\opencode', `chrome-qa-${Date.now()}`);
mkdirSync(profile, { recursive: true });
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--disable-gpu', '--window-size=1440,2000', 'about:blank',
], { stdio: 'ignore', detached: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(path) {
  for (let i = 0; i < 50; i++) {
    try { return await (await fetch(`http://127.0.0.1:${PORT}${path}`)).json(); }
    catch { await sleep(200); }
  }
  throw new Error('chrome devtools not reachable');
}

function cdp(wsUrl) {
  let id = 0;
  const pending = new Map();
  const log = [];
  const ws = new WebSocket(wsUrl);
  const opened = new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? reject(new Error(m.error.message)) : resolve(m.result);
    } else if (m.method && m.method !== 'Network.loadingFinished' && m.method !== 'Network.requestWillBeSent') {
      log.push(m);
    }
  };
  return {
    send: (method, params = {}) => opened.then(() => new Promise((resolve, reject) => {
      const mid = ++id;
      pending.set(mid, { resolve, reject });
      ws.send(JSON.stringify({ id: mid, method, params }));
    })),
    log, close: () => ws.close(),
  };
}

async function main() {
  const tab = await getJson(`/json/new?${encodeURIComponent(BASE)}`);
  const page = cdp(tab.webSocketDebuggerUrl);
  await page.send('Page.enable');
  await page.send('Runtime.enable');
  await page.send('Log.enable');
  await sleep(1200);

  const evalJs = (expression) => page.send('Runtime.evaluate', { expression, returnByValue: true })
    .then((r) => r.result?.value);

  const snap = async (name) => {
    try {
      const { data } = await page.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
      writeFileSync(join(OUT, `${name}.png`), Buffer.from(data, 'base64'));
      console.log('shot:', name);
    } catch (e) { console.log('shot FAILED:', name, e.message); }
  };

  const setWidth = async (w) => {
    await page.send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: false });
    await sleep(300);
  };

  const click = async (text) => {
    await page.send('Runtime.evaluate', {
      expression: `[...document.querySelectorAll('button,a')].reverse().find(el => el.textContent.trim() === ${JSON.stringify(text)})?.click(); 1;`,
    });
    await sleep(750);
  };

  await evalJs(`document.readyState === 'complete' ? 1 : 0`);
  await sleep(800);

  await click('Dashboard');
  await snap('dashboard-1440');
  await setWidth(768); await snap('dashboard-768');
  await setWidth(390); await snap('dashboard-390');
  await setWidth(1440);
  await evalJs('window.scrollTo(0, 400); 1'); await sleep(300); await snap('dashboard-mid-1440');

  await click('Screening');
  await snap('screening-1440');

  await click('Alerts');
  await snap('alerts-1440');

  await click('History');
  await snap('history-1440');

  const content = await evalJs(`document.querySelector('h1')?.textContent || document.title || ''`);
  console.log('final h1:', content);

  const errors = page.log
    .filter((m) =>
      (m.method === 'Runtime.exceptionThrown') ||
      (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') ||
      (m.method === 'Log.entryAdded' && m.params.entry.level === 'error'))
    .map((m) => JSON.stringify(m.params).slice(0, 400));
  console.log('console/page errors:', errors.length ? errors : 'none');
  page.close();
}

main().catch((e) => { console.error('QA ERROR:', e.message); process.exitCode = 1; }).finally(() => chrome.kill());