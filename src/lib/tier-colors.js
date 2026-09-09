export const TIER_META = {
  LOW:      { label: 'VERIFIED',        short: 'Low',      color: 'green',  order: 0 },
  MODERATE: { label: 'REVIEW REQUIRED', short: 'Moderate', color: 'amber',  order: 1 },
  HIGH:     { label: 'HIGH RISK',       short: 'High',     color: 'orange', order: 2 },
  CRITICAL: { label: 'CRITICAL',        short: 'Critical', color: 'red',    order: 3 },
};

export function tierMeta(tier) {
  return TIER_META[tier] || TIER_META.LOW;
}

export function isFlagged(tier) {
  return tierMeta(tier).order >= 1;
}

export function tierColor(tier) {
  return tierMeta(tier).color;
}
