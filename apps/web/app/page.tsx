import Link from "next/link";
import { translator, type MessageKey } from "@milhojas/core";
import { getLocale, numberLocale } from "../lib/i18n";
import { Demo } from "./demo";
import { LanguageToggle } from "./language-toggle";

const POINTS: { title: MessageKey; body: MessageKey }[] = [
  { title: "landing.point1_title", body: "landing.point1_body" },
  { title: "landing.point2_title", body: "landing.point2_body" },
  { title: "landing.point3_title", body: "landing.point3_body" },
];

export default async function LandingPage() {
  const locale = await getLocale();
  const tr = translator(locale);

  return (
    <div className="landing">
      <header className="site-header">
        <span className="wordmark">{tr("app.name")}</span>
        <div className="header-tools">
          <LanguageToggle locale={locale} />
          <Link href="/entrar" className="button small">
            {tr("landing.sign_in")}
          </Link>
        </div>
      </header>

      <main>
        <section className="hero">
          <h1>{tr("app.tagline")}</h1>
          <p className="lead">{tr("landing.hero_body")}</p>
          <div className="hero-cta">
            <Link href="/entrar" className="button primary large">
              {tr("landing.cta")}
            </Link>
            <span className="fine">{tr("landing.cta_note")}</span>
          </div>
        </section>

        <section className="demo-section" aria-label={tr("demo.label")}>
          <Demo locale={locale} numberLocale={numberLocale(locale)} />
        </section>

        <section className="points">
          {POINTS.map((point, i) => (
            <article key={point.title} className="point">
              <span className="point-num">{i + 1}</span>
              <h2>{tr(point.title)}</h2>
              <p className="muted">{tr(point.body)}</p>
            </article>
          ))}
        </section>
      </main>

      <footer className="site-footer">
        <span>{tr("landing.where")}</span>
        <span>{tr("landing.footer")}</span>
      </footer>
    </div>
  );
}
