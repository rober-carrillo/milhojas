import { DEFAULT_LOCALE, translator } from "@milhojas/core";

// Placeholder home. Vendor onboarding (P3) and the consumer feed (Phase 2) replace it.
export default function HomePage() {
  const tr = translator(DEFAULT_LOCALE);
  return (
    <main className="home">
      <h1>{tr("app.name")}</h1>
      <p className="tagline">{tr("app.tagline")}</p>
      <div className="actions">
        <span className="button primary">{tr("home.vendor_cta")}</span>
        <span className="button">{tr("home.consumer_cta")}</span>
      </div>
      <p className="note">{tr("home.coming_soon")}</p>
    </main>
  );
}
