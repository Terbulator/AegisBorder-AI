export const SCREENING_TYPES = [
  { key: 'aadhaar',   label: 'Aadhaar Card',   module: 'aadhaar',   description: 'Identity verification via Aadhaar number, photo, and demographic data.' },
  { key: 'passport',  label: 'Passport',        module: 'passport',  description: 'International travel document verification with MRZ and chip data.' },
  { key: 'pan',       label: 'PAN Card',        module: 'pan',       description: 'Income tax identification card verification and validation.' },
  { key: 'dl',        label: 'Driving License', module: 'dl',        description: 'Driving license verification with vehicle class data.' },
  { key: 'vehicle',   label: 'Vehicle RC',      module: 'vehicle',   description: 'Vehicle registration certificate and ownership verification.' },
  { key: 'bank',      label: 'Bank Statement',  module: 'bank',      description: 'Financial statement verification for income and transaction analysis.' },
  { key: 'fraud',     label: 'Fraud Detection', module: 'fraud',     description: 'Cross-reference screening against known fraud patterns and databases.' },
];

export function getScreeningType(key) {
  return SCREENING_TYPES.find(t => t.key === key) || null;
}

export function getScreeningModule(key) {
  const t = getScreeningType(key);
  return t ? t.module : key;
}
