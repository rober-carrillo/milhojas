import { translator, type Locale } from "@milhojas/core";
import { setLocale } from "./actions";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const tr = translator(locale);
  return (
    <form action={setLocale}>
      <input type="hidden" name="locale" value={locale === "es" ? "en" : "es"} />
      <button type="submit" className="link-button" aria-label={tr("lang.other_label")}>
        {tr("lang.other")}
      </button>
    </form>
  );
}
