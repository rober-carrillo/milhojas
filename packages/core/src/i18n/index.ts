import { en } from "./en";
import { es, type MessageKey } from "./es";

export type Locale = "es" | "en";
export type { MessageKey };

export const DEFAULT_LOCALE: Locale = "es";

const catalogs: Record<Locale, Record<MessageKey, string>> = { es, en };

export function t(locale: Locale, key: MessageKey): string {
  return catalogs[locale][key];
}

/** Bind a locale once: const tr = translator("es"); tr("app.name"). */
export function translator(locale: Locale): (key: MessageKey) => string {
  return (key) => t(locale, key);
}

export { es, en };
