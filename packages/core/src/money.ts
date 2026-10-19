// Money is never a JS float. Amounts travel as decimal strings (e.g. "4500.50")
// or as integer minor units (e.g. 450050), matching numeric columns in Postgres.

export const CURRENCIES = ["COP", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

/** ISO 4217 minor-unit exponent per currency. */
export const MINOR_UNITS: Record<Currency, number> = { COP: 2, USD: 2 };

const DECIMAL_RE = /^-?\d+(\.\d+)?$/;

/** "4500.5" (COP) -> 450050. Throws on malformed input or excess precision. */
export function toMinorUnits(amount: string, currency: Currency): number {
  const trimmed = amount.trim();
  if (!DECIMAL_RE.test(trimmed)) {
    throw new Error(`Invalid amount: "${amount}"`);
  }
  const exponent = MINOR_UNITS[currency];
  const negative = trimmed.startsWith("-");
  const [whole = "0", fraction = ""] = trimmed.replace("-", "").split(".");
  if (fraction.length > exponent) {
    throw new Error(`Too many decimals for ${currency}: "${amount}"`);
  }
  const minor = Number(whole + fraction.padEnd(exponent, "0"));
  if (!Number.isSafeInteger(minor)) {
    throw new Error(`Amount out of range: "${amount}"`);
  }
  return negative ? -minor : minor;
}

/** 450050 (COP) -> "4500.50". */
export function fromMinorUnits(minor: number, currency: Currency): string {
  if (!Number.isSafeInteger(minor)) {
    throw new Error(`Minor units must be a safe integer: ${minor}`);
  }
  const exponent = MINOR_UNITS[currency];
  const negative = minor < 0;
  const digits = Math.abs(minor).toString().padStart(exponent + 1, "0");
  const whole = digits.slice(0, digits.length - exponent);
  const fraction = digits.slice(digits.length - exponent);
  return `${negative ? "-" : ""}${whole}${exponent > 0 ? `.${fraction}` : ""}`;
}

/** units × unit price, in minor units. */
export function lineTotal(units: number, unitPriceMinor: number): number {
  if (!Number.isInteger(units) || units < 0) {
    throw new Error(`Units must be a non-negative integer: ${units}`);
  }
  const total = units * unitPriceMinor;
  if (!Number.isSafeInteger(total)) {
    throw new Error("Line total out of range");
  }
  return total;
}

/** Profit for a sale line; cost is optional (vendors may not know it). */
export function lineProfit(
  units: number,
  unitPriceMinor: number,
  unitCostMinor: number | null,
): number | null {
  if (unitCostMinor === null) return null;
  return lineTotal(units, unitPriceMinor) - lineTotal(units, unitCostMinor);
}

/** Display formatting. COP hides cents when they are zero, as vendors expect. */
export function formatMoney(minor: number, currency: Currency, locale = "es-CO"): string {
  const exponent = MINOR_UNITS[currency];
  const hasCents = minor % 10 ** exponent !== 0;
  const fractionDigits = currency === "COP" && !hasCents ? 0 : exponent;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(minor / 10 ** exponent);
}
