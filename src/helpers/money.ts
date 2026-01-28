export function asNum(v: unknown, fallback = 0): number {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function clampVatRatePercent(v: unknown, fallback = 25): number {
  const n = asNum(v, fallback);
  if (n === 6 || n === 12 || n === 25) return n;
  return fallback;
}

export function priceIncVat(priceExVat: unknown, vatRatePercent: unknown, fallbackVat = 25): number {
  const ex = asNum(priceExVat, 0);
  const vat = clampVatRatePercent(vatRatePercent, fallbackVat);
  return round2(ex * (1 + vat / 100));
}

export function lineIncVat(priceExVat: unknown, vatRatePercent: unknown, qty: unknown, fallbackVat = 25): number {
  const q = Math.max(0, Math.floor(asNum(qty, 0)));
  const ex = asNum(priceExVat, 0);
  const vat = clampVatRatePercent(vatRatePercent, fallbackVat);
  return round2(ex * q * (1 + vat / 100));
}

export function vatAmountFromEx(priceExVat: unknown, vatRatePercent: unknown, qty: unknown, fallbackVat = 25): number {
  const q = Math.max(0, Math.floor(asNum(qty, 0)));
  const ex = asNum(priceExVat, 0);
  const vat = clampVatRatePercent(vatRatePercent, fallbackVat);
  return round2(ex * q * (vat / 100));
}
