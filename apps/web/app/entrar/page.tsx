import Link from "next/link";
import { translator } from "@milhojas/core";
import { getLocale } from "../../lib/i18n";
import { LanguageToggle } from "../language-toggle";
import { LogoMark } from "../logo";
import { SignInForm } from "./sign-in-form";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const locale = await getLocale();
  const tr = translator(locale);
  const { error } = await searchParams;

  return (
    <div className="narrow-page">
      <header className="site-header">
        <Link href="/" className="wordmark">
          <LogoMark size={28} />
          {tr("app.name")}
        </Link>
        <LanguageToggle locale={locale} />
      </header>
      <main className="card form-card">
        {/* The key resets the form when the language changes. */}
        <SignInForm key={locale} locale={locale} initialError={error === "link" ? "auth.link_failed" : null} />
      </main>
    </div>
  );
}
