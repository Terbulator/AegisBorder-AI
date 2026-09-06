const BASE = '/api';

async function req(path, options) {
  const res = await fetch(`${BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || `Request failed (${res.status})`);
  return data;
}

export function apiHealth() {
  return req('/health');
}

export function apiPresets() {
  return req('/presets');
}

export function apiPresetDetail(presetId) {
  return req(`/presets/${encodeURIComponent(presetId)}`);
}

export function apiScreenDocument(payload) {
  return req('/screen-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

export function apiRegisterPassenger(payload) {
  return req('/passengers/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

export function apiDeletePassenger(presetId) {
  return req(`/passengers/${encodeURIComponent(presetId)}`, { method: 'DELETE' });
}

export function apiUrlReputation(url) {
  return req('/url-reputation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
}

export function apiDecodeQr(imageDataUrl, filename = 'qr.png') {
  const bytes = atob(imageDataUrl.split(',')[1] || imageDataUrl);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  const form = new FormData();
  form.append('file', new Blob([arr], { type: 'image/png' }), filename);
  return fetch(`${BASE}/qr-decode`, { method: 'POST', body: form })
    .then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || `Request failed (${res.status})`);
      return data;
    });
}

export function apiScanApp(name, file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const dataUrl = typeof file === 'string' ? file : reader.result;
      req('/app-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, file_b64: dataUrl })
      }).then(resolve).catch(reject);
    };
    reader.onerror = () => reject(new Error('Could not read the uploaded file.'));
    if (typeof file === 'string') reader.onload();
    else reader.readAsDataURL(file);
  });
}

export function apiAiThreat(content, title) {
  return req('/ai-threat-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, title })
  });
}