import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { nextOnboardingStep, translator } from "@milhojas/core";
import { getLocale } from "../../lib/i18n";
import { currentVendor } from "../../lib/vendor";
import { signOut } from "../actions";
import { LanguageToggle } from "../language-toggle";
import { LogoMark } from "../logo";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const [locale, vendor] = await Promise.all([getLocale(), currentVendor()]);
  if (!vendor) redirect("/entrar");
  if (nextOnboardingStep(vendor) !== "done") redirect("/empezar");
  const tr = translator(locale);

  return (
    <div className="panel">
      <header className="panel-header">
        <div className="panel-title">
          <Link href="/" className="wordmark">
            <LogoMark size={28} />
            {tr("app.name")}
          </Link>
          <span className="business-name">{vendor.business?.name}</span>
        </div>
        <nav className="panel-nav" aria-label={tr("app.name")}>
          <Link href="/panel/productos" className="on" aria-current="page">
            {tr("panel.products")}
          </Link>
        </nav>
        <div className="panel-tools">
          <LanguageToggle locale={locale} />
          <form action={signOut}>
            <button type="submit" className="link-button">
              {tr("panel.sign_out")}
            </button>
          </form>
        </div>
      </header>
      <main className="panel-main">{children}</main>
    </div>
  );
}
