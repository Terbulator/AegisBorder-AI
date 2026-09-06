const HISTORY_KEY = 'rakshak_history_v1';
const ALERTS_KEY = 'rakshak_alerts_v1';
const MAX_RECORDS = 60;

export const TIER_META = {
  LOW:      { label: 'VERIFIED',        short: 'Low',    color: 'green',  order: 0 },
  MODERATE: { label: 'REVIEW REQUIRED', short: 'Moderate', color: 'amber', order: 1 },
  HIGH:     { label: 'HIGH RISK',       short: 'High',   color: 'orange', order: 2 },
  CRITICAL: { label: 'CRITICAL',        short: 'Critical', color: 'red',  order: 3 },
};

export function tierMeta(tier) {
  return TIER_META[tier] || TIER_META.LOW;
}

export function isFlagged(tier) {
  const order = tierMeta(tier).order;
  return order >= 1;
}

export function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export function secondsAgo(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const sec = Math.max(0, Math.round((Date.now() - d.getTime()) / 1000));
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

function recordFromScreening(id, screening, meta) {
  const risk = screening.risk_assessment || {};
  const mrz = screening.extracted_data?.mrz || {};
  const viz = screening.extracted_data?.viz || {};
  const watchlist = screening.watchlist_screening || {};
  return {
    id,
    ts: new Date().toISOString(),
    person: v(mrz.full_name || viz.full_name),
    documentNumber: v(mrz.document_number || viz.document_number),
    documentType: v(mrz.document_type || viz.document_type || 'Passport'),
    nationality: v(mrz.nationality || viz.nationality),
    riskTier: risk.risk_tier || 'LOW',
    riskScore: risk.overall_risk_score ?? 0,
    decision: risk.recommended_decision || 'GRANT ENTRY',
    source: meta?.source || 'scenario',
    scenario: meta?.scenario || null,
    watchlistFlagged: !!watchlist.flagged,
    summary: {
      validationValid: !!screening.document_validation?.is_valid,
      faceMatched: screening.biometrics?.is_matched,
      faceScore: screening.biometrics?.match_score,
      photoTampered: !!screening.forensics?.summary?.is_photo_tampered,
    },
    full: screening,
    truncated: false,
  };
}

function v(x) { return x ?? '—'; }

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    if (key === HISTORY_KEY && e?.name === 'QuotaExceededError') {
      const stripped = value.map((r) => {
        const copy = { ...r };
        if (copy.full?.forensics?.visuals) {
          copy.full.forensics.visuals = {};
          copy.truncated = true;
        }
        return copy;
      });
      try {
        localStorage.setItem(key, JSON.stringify(stripped));
      } catch {
        localStorage.removeItem(key);
      }
    }
  }
}

export function getHistory() {
  return read(HISTORY_KEY);
}

export function addToHistory(screening, meta) {
  const list = getHistory();
  const record = recordFromScreening(`SC-${Date.now()}`, screening, meta);
  list.unshift(record);
  write(HISTORY_KEY, list.slice(0, MAX_RECORDS));
  return record;
}

export function getRecord(id) {
  return getHistory().find((r) => r.id === id) || null;
}

export function updateRecordStatus(id, status) {
  write(HISTORY_KEY, getHistory().map((r) => (r.id === id ? { ...r, officerStatus: status } : r)));
}

export function deleteRecord(id) {
  write(HISTORY_KEY, getHistory().filter((r) => r.id !== id));
}

export function clearHistory() {
  write(HISTORY_KEY, []);
  write(ALERTS_KEY, []);
}

export function getAlerts() {
  return read(ALERTS_KEY);
}

export function resolveAlert(id, resolution) {
  const list = getAlerts().map((a) => (a.id === id ? { ...a, resolution } : a));
  write(ALERTS_KEY, list);
  return list;
}

export function syncAlertsFromHistory() {
  const manual = read(ALERTS_KEY).filter((a) => a.resolution);
  const consolidated = [];
  for (const r of getHistory()) {
    const rank = tierMeta(r.riskTier).order;
    const watchlistFlag = r.watchlistFlagged;
    if (rank < 2 && !watchlistFlag) continue;
    const severity = watchlistFlag ? (r.riskTier === 'LOW' || r.riskTier === 'MODERATE' ? 'High' : tierMeta(r.riskTier).short) : tierMeta(r.riskTier).short;
    consolidated.push({
      id: r.id,
      ts: r.ts,
      severity,
      title: watchlistFlag
        ? 'Potential watchlist match'
        : (r.riskTier === 'CRITICAL' ? 'Critical risk screening' : 'High risk screening'),
      person: r.person,
      documentNumber: r.documentNumber,
      riskScore: r.riskScore,
      riskTier: r.riskTier,
      factors: r.full?.risk_assessment?.risk_factors?.map((f) => f.description) || [],
      recommended: r.decision,
      resolution: null,
    });
  }
  const merged = [...consolidated];
  for (const m of manual) {
    const existing = merged.find((a) => a.id === m.id);
    if (existing) existing.resolution = m.resolution;
    else merged.push(m);
  }
  write(ALERTS_KEY, merged.filter((a, i, arr) => arr.findIndex((x) => x.id === a.id) === i));
  return getAlerts();
}

export function kpisFromHistory() {
  const list = getHistory();
  const cleared = list.filter((r) => tierMeta(r.riskTier).order === 0).length;
  const review = list.filter((r) => tierMeta(r.riskTier).order === 1).length;
  const alerts = list.filter((r) => tierMeta(r.riskTier).order >= 2 || r.watchlistFlagged).length;
  return { screened: list.length, cleared, review, alerts };
}

export function analyticsFromHistory() {
  const list = getHistory();
  const byTier = { LOW: 0, MODERATE: 0, HIGH: 0, CRITICAL: 0 };
  const byHour = {};
  let faceFail = 0, tamperFail = 0, validFail = 0, watchlistFail = 0;
  for (const r of list) {
    byTier[r.riskTier] = (byTier[r.riskTier] || 0) + 1;
    const h = r.ts ? new Date(r.ts).getHours() : '?';
    byHour[h] = (byHour[h] || 0) + 1;
    if (r.summary.faceMatched === false) faceFail += 1;
    if (r.summary.photoTampered) tamperFail += 1;
    if (!r.summary.validationValid) validFail += 1;
    if (r.watchlistFlagged) watchlistFail += 1;
  }
  return {
    total: list.length,
    byTier,
    byHour,
    failures: { faceFail, tamperFail, validFail, watchlistFail },
  };
}