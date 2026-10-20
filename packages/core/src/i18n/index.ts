import { en } from "./en";
import { es, type MessageKey } from "./es";

export type Locale = "es" | "en";
export type { MessageKey };
export type MessageVars = Record<string, string | number>;

export const LOCALES: readonly Locale[] = ["es", "en"];
export const DEFAULT_LOCALE: Locale = "es";

const catalogs: Record<Locale, Record<MessageKey, string>> = { es, en };

export function isLocale(value: unknown): value is Locale {
  return value === "es" || value === "en";
}

export function isMessageKey(value: string): value is MessageKey {
  return value in es;
}

/** Translate a key; {name}-style placeholders are filled from vars. */
export function t(locale: Locale, key: MessageKey, vars?: MessageVars): string {
  const message = catalogs[locale][key];
  if (!vars) return message;
  return message.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

/** Bind a locale once: const tr = translator("es"); tr("app.name"). */
export function translator(locale: Locale): (key: MessageKey, vars?: MessageVars) => string {
  return (key, vars) => t(locale, key, vars);
}

export { es, en };
