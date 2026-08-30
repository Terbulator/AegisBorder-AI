// Rakshak AI - content script
// Scans visible message text on web messaging apps in the background and
// raises in-page overlay warnings + forwards detections to the service worker.

(async () => {
  const engineNlp = await import(chrome.runtime.getURL('engine/nlp.js'));
  const engineUrl = await import(chrome.runtime.getURL('engine/urlDetector.js'));
  const engineUpi = await import(chrome.runtime.getURL('engine/upi.js'));

  // ------------------------------------------------------------------
  // Settings
  // ------------------------------------------------------------------
  function getSettings() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'rakshak_get_settings' }, resolve);
    });
  }

  // ------------------------------------------------------------------
  // Text extraction: grab text from the DOM (nice message panels, body, inputs)
  // ------------------------------------------------------------------
  const IGNORE_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'CODE']);
  const MAX_SAMPLE = 4000;

  function extractText(el) {
    if (!el) return '';
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (IGNORE_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        const s = node.nodeValue;
        // only meaningful chunks with potential scam keywords or urls
        if (!s || s.trim().length < 3) return NodeFilter.FILTER_REJECT;
        if (!/[a-z]{3,}/i.test(s)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const parts = [];
    while (walker.nextNode() && parts.join(' ').length < MAX_SAMPLE) {
      const t = walker.currentNode.nodeValue.trim();
      if (t) parts.push(t);
    }
    return parts.join(' \u2022 ').slice(0, MAX_SAMPLE);
  }

  // ------------------------------------------------------------------
  // Overlay UI (in-page banner so the user is warned where they see it)
  // ------------------------------------------------------------------
  function injectOverlayCss() {
    if (document.getElementById('rakshak-overlay-style')) return;
    const link = document.createElement('link');
    link.id = 'rakshak-overlay-style';
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('overlay.css');
    document.documentElement.appendChild(link);
  }

  function showOverlay(payload) {
    injectOverlayCss();
    if (document.getElementById('rakshak-overlay')) return; // one at a time

    const host = document.createElement('div');
    host.id = 'rakshak-overlay';
    host.className = 'rakshak-overlay rakshak-' + (payload.severity || 'HIGH').toLowerCase();

    host.innerHTML =
      '<div class="rakshak-overlay-inner">' +
        '<div class="rakshak-overlay-icon">RAKSHAK</div>' +
        '<div class="rakshak-overlay-body">' +
          '<div class="rakshak-overlay-title">' + escapeHtml(payload.title || 'Threat detected') + '</div>' +
          '<div class="rakshak-overlay-detail">' + escapeHtml(payload.detail || '') + '</div>' +
          (payload.domain
            ? '<div class="rakshak-overlay-domain">Suspicious domain: <b>' + escapeHtml(payload.domain) + '</b></div>'
            : '') +
          '<div class="rakshak-overlay-foot">Rakshak AI - Cyber Scam Shield &bull; Report at <b>1930</b></div>' +
        '</div>' +
        '<button class="rakshak-overlay-close" title="Close">&times;</button>' +
      '</div>';

    host.querySelector('.rakshak-overlay-close').addEventListener('click', () => {
      host.remove();
    });

    document.documentElement.appendChild(host);
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ------------------------------------------------------------------
  // Scan a candidate text blob once.
  // Returns a payload if a threat is detected, else null.
  // ------------------------------------------------------------------
  function scanBlob(text) {
    if (!text || text.length < 3) return null;
    const nlp = engineNlp.analyzeText(text);

    // URL inspection inside the blob
    let urlResult = null;
    if (nlp.extUrls && nlp.extUrls.length) {
      for (const u of nlp.extUrls.slice(0, 12)) {
        const r = engineUrl.inspectUrl(u);
        if (r && r.isThreat) urlResult = r;
      }
    }

    // UPI deep-link inspection
    const upiPayload = text.match(/upi:\/\/pay[^\s"'<>()]+/i);
    let upiResult = null;
    if (upiPayload) upiResult = engineUpi.inspectUpi(upiPayload[0]);

    const scores = [
      nlp.isThreat ? nlp.riskScore : 0,
      urlResult ? urlResult.riskScore : 0,
      upiResult ? upiResult.riskScore : 0
    ];
    const max = Math.max(...scores);
    if (max < 70) return null;

    const bestNlp = nlp.best || {};
    let title = bestNlp.title || 'Suspicious message detected';
    let detail = bestNlp.explanation || 'Suspicious patterns detected in a message.';
    let domain = '';

    if (urlResult && urlResult.riskScore === max) {
      title = 'Phishing link in message';
      detail = urlResult.reasons.join(' ');
      domain = urlResult.domain;
    }
    if (upiResult && upiResult.riskScore === max) {
      title = 'UPI debit trap in message';
      detail = upiResult.reasons.join(' ') || upiResult.frictionMessage;
    }

    return {
      riskScore: max,
      severity: max >= 85 ? 'CRITICAL' : 'HIGH',
      title,
      detail,
      domain,
      hash: max + '|' + (domain || title)
    };
  }

  // ------------------------------------------------------------------
  // Main loop: sample the page in the background periodically.
  // ------------------------------------------------------------------
  let lastSample = '';
  let overlayEnabled = true;
  let running = false;

  async function tick() {
    try {
      const settings = await getSettings();
      if (!settings || !settings.enabled) return;
      overlayEnabled = !!settings.overlay;

      const root = document.body;
      if (!root) return;
      const sample = extractText(root);
      if (!sample || sample === lastSample) return;
      lastSample = sample;

      const payload = scanBlob(sample);
      if (!payload) return;

      if (overlayEnabled) showOverlay(payload);

      // Send to background worker for notification + badge
      chrome.runtime.sendMessage({ type: 'rakshak_detection', detection: payload });
    } catch (e) {
      // Keep the loop resilient
    }
  }

  // Throttled interval
  setInterval(() => {
    if (running) return;
    running = true;
    setTimeout(() => { running = false; }, 500);
    tick();
  }, 4000);
})();
