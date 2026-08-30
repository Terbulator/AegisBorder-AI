// Rakshak AI - background service worker (MV3)
// Runs 24/7 in the background, aggregates detection events from content scripts
// and blocked/visited URLs, then raises notifications + toolbar badge.

import { inspectUrl } from './engine/urlDetector.js';

const DEFAULTS = {
  notifications: true,
  badge: true,
  overlay: true,
  urlScan: true,
  enabled: true,
  seen: {},
  incidents: []
};

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------
function getState() {
  return new Promise((resolve) => {
    chrome.storage.local.get(DEFAULTS, (data) => resolve(data));
  });
}

function saveState(state) {
  return new Promise((resolve) => chrome.storage.local.set(state, resolve));
}

async function withState(fn) {
  const state = await getState();
  const out = await fn(state);
  if (out !== undefined) await saveState(out);
  return out;
}

// ---------------------------------------------------------------------------
// URL / navigation monitoring (phishing links you click)
// ---------------------------------------------------------------------------
function normalizeHostname(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch (e) {
    return '';
  }
}

async function handleUrl(url, source) {
  const state = await getState();
  if (!state.enabled || !state.urlScan) return;

  const result = inspectUrl(url);
  if (!result) return;
  if (result.safe) return;

  const host = normalizeHostname(url);
  const key = 'url|' + host;
  const now = Date.now();

  // De-duplicate: don't spam repeated alerts for same host within 60s
  if (state.seen[key] && now - state.seen[key] < 60000) return;

  state.seen[key] = now;
  state.incidents = [
    {
      ts: new Date().toISOString(),
      kind: 'url',
      riskScore: result.riskScore,
      severity: result.riskScore >= 85 ? 'CRITICAL' : 'HIGH',
      title: 'Phishing / scam link detected',
      detail: result.reasons.join(' '),
      domain: host,
      source: source || 'link clicked'
    },
    ...state.incidents.slice(0, 99)
  ];
  await saveState(state);

  raiseAlert(state, {
    title: 'RAKSHAK: Phishing link - ' + host,
    message: (result.spoofedTarget ? 'Mimics ' + result.spoofedTarget + '. ' : '') +
      result.reasons.join(' ')
  }, result.riskScore);
}

// ---------------------------------------------------------------------------
// Alerts raised by content scripts (message scan results)
// ---------------------------------------------------------------------------
async function handleDetection(detection) {
  const state = await getState();
  if (!state.enabled || !state.notifications) return;

  const key = 'msg|' + (detection.hash || (detection.title + '|' + detection.riskScore));
  const now = Date.now();
  if (state.seen[key] && now - state.seen[key] < 90000) return;
  state.seen[key] = now;

  state.incidents = [
    {
      ts: new Date().toISOString(),
      kind: 'message',
      riskScore: detection.riskScore,
      severity: detection.severity,
      title: detection.title,
      detail: detection.detail || '',
      domain: detection.domain || '',
      source: detection.source || 'web message'
    },
    ...state.incidents.slice(0, 99)
  ];
  await saveState(state);

  raiseAlert(state, {
    title: 'RAKSHAK: ' + (detection.title || 'Threat detected'),
    message: detection.detail || 'A suspicious message was detected in the background.'
  }, detection.riskScore);
}

let alertInFlight = false;
async function raiseAlert(state, { title, message }, riskScore) {
  if (state.badge) {
    await chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
    await chrome.action.setBadgeText({ text: riskScore >= 85 ? '!' : '⚠' });
  }
  if (state.notifications && !alertInFlight) {
    alertInFlight = true;
    const id = 'rakshak_' + Date.now();
    chrome.notifications.create(id, {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: title.slice(0, 50),
      message: message.slice(0, 180),
      priority: riskScore >= 85 ? 2 : 0,
      contextMessage: 'Rakshak AI - Cyber Scam Shield (1930)'
    });
    const clear = () => { alertInFlight = false; };
    chrome.alarms.create('notif_clear', { when: Date.now() + 10000 });
    setTimeout(clear, 11000);
  }
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
chrome.runtime.onInstalled.addListener(async () => {
  const state = await getState();
  state.enabled = true;
  state.notifications = true;
  state.badge = true;
  state.overlay = true;
  state.urlScan = true;
  await saveState(state);
});

// Message scan results sent from content scripts
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'rakshak_detection') {
    const detection = {
      ...msg.detection,
      source: sender.tab ? (sender.tab.url || 'web') : 'web'
    };
    handleDetection(detection);
    sendResponse({ ok: true });
    return true;
  }
  if (msg && msg.type === 'rakshak_get_settings') {
    getState().then((s) => sendResponse({
      enabled: s.enabled,
      notifications: s.notifications,
      badge: s.badge,
      overlay: s.overlay,
      urlScan: s.urlScan,
      incidents: s.incidents
    }));
    return true;
  }
  if (msg && msg.type === 'rakshak_set_settings') {
    withState((s) => ({ ...s, [msg.key]: msg.value })).then((next) => {
      chrome.action.setBadgeText({ text: '' });
      sendResponse({ ok: true });
    });
    return true;
  }
  if (msg && msg.type === 'rakshak_clear_incidents') {
    withState((s) => ({ ...s, incidents: [], seen: {} })).then((next) => {
      chrome.action.setBadgeText({ text: '' });
      sendResponse({ ok: true });
    });
    return true;
  }
  return false;
});

// Monitor navigations so we can also watch the currently active page URL in background
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.url && tab.url.startsWith('http')) {
    handleUrl(tab.url, 'visited page');
  }
});
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (tab && tab.url && tab.url.startsWith('http')) {
      handleUrl(tab.url, 'active tab');
    }
  } catch (e) { /* tab closed */ }
});

// Clear stale notifications
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'notif_clear') {
    chrome.notifications.getAll((ids) => {
      Object.keys(ids).forEach((id) => {
        if (id.startsWith('rakshak_')) chrome.notifications.clear(id);
      });
    });
  }
});

// Open popup on notification click
chrome.notifications.onClicked.addListener((id) => {
  chrome.notifications.clear(id);
  if (chrome.action && typeof chrome.action.openPopup === 'function') {
    chrome.action.openPopup();
  }
});
