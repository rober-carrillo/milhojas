import Link from "next/link";
import { redirect } from "next/navigation";
import { nextOnboardingStep, translator } from "@milhojas/core";
import { getLocale } from "../../lib/i18n";
import { currentVendor } from "../../lib/vendor";
import { LanguageToggle } from "../language-toggle";
import { LogoMark } from "../logo";
import { BusinessForm } from "./business-form";
import { ProfileForm } from "./profile-form";

export default async function OnboardingPage() {
  const [locale, vendor] = await Promise.all([getLocale(), currentVendor()]);
  if (!vendor) redirect("/entrar");
  const step = nextOnboardingStep(vendor);
  if (step === "done") redirect("/panel/productos");

  const tr = translator(locale);
  const n = step === "profile" ? 1 : 2;

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
        <div className="stepper" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <i key={i} className={i <= n ? "on" : undefined} />
          ))}
        </div>
        <p className="eyebrow">{tr("onboarding.step", { n })}</p>
        {step === "profile" ? (
          <ProfileForm key={locale} locale={locale} defaultName={vendor.profile?.display_name ?? ""} />
        ) : (
          <BusinessForm key={locale} locale={locale} />
        )}
      </main>
    </div>
  );
}
