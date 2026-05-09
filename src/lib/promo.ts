// Promo codes — single source of truth for client + server.
// percent is 0-100.

export interface PromoCode {
  code: string;
  percent: number;
  label: string;
}

export const PROMOS: PromoCode[] = [
  { code: "BINDI10", percent: 10, label: "10% off" },
  { code: "FIRST10", percent: 10, label: "10% off (first order)" },
];

export function lookupPromo(rawCode: string | null | undefined): PromoCode | null {
  if (!rawCode) return null;
  const code = rawCode.trim().toUpperCase();
  return PROMOS.find((p) => p.code === code) || null;
}
