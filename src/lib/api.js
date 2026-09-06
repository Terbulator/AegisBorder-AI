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