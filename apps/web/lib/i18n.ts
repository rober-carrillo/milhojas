// Locale for the current request: the "locale" cookie, Spanish by default.
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isLocale, isMessageKey, type Locale, type MessageKey } from "@milhojas/core";

export const LOCALE_COOKIE = "locale";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Intl locale for numbers and money. */
export function numberLocale(locale: Locale): string {
  return locale === "es" ? "es-CO" : "en-US";
}

/** Maps a zod issue message ("required", "invalid_whatsapp"…) to its errors.* string. */
export function errorKey(message: string | undefined): MessageKey {
  const key = `errors.${message ?? "invalid"}`;
  return isMessageKey(key) ? key : "errors.invalid";
}
