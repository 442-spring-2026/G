const DEFAULT_DOSAGE_UNIT = "mg";

export function parseDosage(dosage) {
  const raw = dosage == null ? "" : String(dosage).trim();

  if (!raw) {
    return { amount: "", unit: DEFAULT_DOSAGE_UNIT };
  }

  const match = raw.match(/^(\d+(?:\.\d+)?)(?:\s*([^\s].*))?$/);
  if (!match) {
    return { amount: raw, unit: DEFAULT_DOSAGE_UNIT };
  }

  return {
    amount: match[1],
    unit: match[2] ? match[2].trim() : DEFAULT_DOSAGE_UNIT,
  };
}

export function formatDosage(dosage) {
  const { amount, unit } = parseDosage(dosage);

  if (!amount) {
    return "";
  }

  return `${amount} ${unit || DEFAULT_DOSAGE_UNIT}`.trim();
}

export function buildDosage(amount, unit = DEFAULT_DOSAGE_UNIT) {
  const cleanAmount = String(amount ?? "").trim();
  const cleanUnit = String(unit ?? DEFAULT_DOSAGE_UNIT).trim() || DEFAULT_DOSAGE_UNIT;

  if (!cleanAmount) {
    return "";
  }

  return `${cleanAmount} ${cleanUnit}`;
}