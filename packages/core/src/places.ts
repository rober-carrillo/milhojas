// Launch cities, business categories and phone helpers shared by web and mobile.
import type { Currency } from "./money";

export type CountryCode = "CO" | "US";

export const COUNTRIES: Record<CountryCode, { dialCode: string; currency: Currency }> = {
  CO: { dialCode: "57", currency: "COP" },
  US: { dialCode: "1", currency: "USD" },
};

export interface City {
  id: string;
  /** Proper noun, shown as is in every language. */
  name: string;
  country: CountryCode;
  lat: number;
  lng: number;
}

/** Pilot cities. A business without an exact pin is placed at its city's center. */
export const CITIES = [
  { id: "pereira", name: "Pereira", country: "CO", lat: 4.8133, lng: -75.6961 },
  { id: "dosquebradas", name: "Dosquebradas", country: "CO", lat: 4.8391, lng: -75.6673 },
  { id: "santa-rosa-de-cabal", name: "Santa Rosa de Cabal", country: "CO", lat: 4.8681, lng: -75.6214 },
  { id: "san-francisco", name: "San Francisco", country: "US", lat: 37.7749, lng: -122.4194 },
  { id: "oakland", name: "Oakland", country: "US", lat: 37.8044, lng: -122.2712 },
  { id: "san-jose", name: "San José", country: "US", lat: 37.3382, lng: -121.8863 },
] as const satisfies readonly City[];

export type CityId = (typeof CITIES)[number]["id"];

export function findCity(id: string): City | undefined {
  return CITIES.find((city) => city.id === id);
}

/** Category ids stored in businesses.category; labels live in i18n under "category.<id>". */
export const CATEGORIES = [
  "comida",
  "bebidas",
  "frutas",
  "artesanias",
  "ropa",
  "belleza",
  "servicios",
  "otro",
] as const;

export type Category = (typeof CATEGORIES)[number];

/**
 * Builds an E.164 number from the chosen dial code and what the vendor typed.
 * Spaces, dashes and parentheses are ignored. A number typed with "+" is taken
 * as already international; local numbers are 10 digits in both pilot countries,
 * so a longer one that starts with the dial code already includes it.
 */
export function toE164(dialCode: string, typed: string): string {
  const digits = typed.replace(/\D/g, "");
  if (typed.trim().startsWith("+")) return `+${digits}`;
  if (digits.length > 10 && digits.startsWith(dialCode)) return `+${digits}`;
  return `+${dialCode}${digits}`;
}
