import { redirect } from "next/navigation";
import { formatMoney, listMyProducts, toMinorUnits, translator, type Currency } from "@milhojas/core";
import { getLocale, numberLocale } from "../../../lib/i18n";
import { createClient } from "../../../lib/supabase/server";
import { currentVendor } from "../../../lib/vendor";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ nuevo?: string }>;
}) {
  const [locale, vendor, { nuevo }] = await Promise.all([getLocale(), currentVendor(), searchParams]);
  if (!vendor?.business) redirect("/empezar");
  const tr = translator(locale);
  const products = await listMyProducts(await createClient(), vendor.business.id);
  const currency = vendor.business.currency as Currency;
  const money = (amount: string) => formatMoney(toMinorUnits(amount, currency), currency, numberLocale(locale));

  return (
    <div className="stack">
      {nuevo === "1" && (
        <p className="banner" role="status">
          {tr("panel.welcome", { name: vendor.profile?.display_name ?? "" })}
        </p>
      )}
      <h1>{tr("panel.products")}</h1>

      {products.length === 0 ? (
        <section className="empty card">
          <div className="empty-art" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <h2>{tr("panel.empty_title")}</h2>
          <p className="muted">{tr("panel.empty_body")}</p>
          <button type="button" className="button primary" disabled aria-describedby="add-soon">
            + {tr("panel.add_first")}
          </button>
          <p id="add-soon" className="fine">
            {tr("panel.coming_soon")}
          </p>
        </section>
      ) : (
        <ul className="product-list card">
          {products.map((product) => (
            <li key={product.id} className={product.is_active ? undefined : "inactive"}>
              <div>
                <b>{product.name}</b>
                <small>
                  {product.cost !== null ? tr("panel.cost", { amount: money(product.cost) }) : null}
                  {product.cost !== null && !product.is_active ? " · " : null}
                  {product.is_active ? null : tr("panel.inactive")}
                </small>
              </div>
              <span className="price">{money(product.price)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
