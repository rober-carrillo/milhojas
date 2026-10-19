# Strategy Notes — July 2026

Answers to six strategic questions, based on fresh research (sources at bottom of each section).

---

## 1. The real case against Treinta — are we still viable?

**Treinta today (verified July 2026):** it is no longer the free app that got 7M signups. Pricing is now **Esencial COP 39,900/mo (app only)** and **Pro COP 79,900/mo (app + web + DIAN e-invoicing)** — the free tier survives only as a crippled fallback for lapsed subscribers. The app is alive (4.7★, ~99K reviews, updated April 2026) but the company pivoted: YC profile now says "Software and AI tools for SMBs in the US and LatAm," team shrank from ~273 to ~60, no funding since 2022, and founder energy is going into **idealane**, a prompt-to-app AI builder. Treinta is in harvest mode on its installed base.

**Their gaps = our openings:**

| Pain Treinta doesn't address | Why it matters |
|---|---|
| **No consumer side at all.** Zero discovery, no browse-nearby, no marketplace. Their catalog is a push-only link the vendor must distribute themselves | Milhojas' whole right half of the product. Demand generation is the #1 thing a vendor actually wants; bookkeeping is medicine, sales are food |
| **Price wall.** COP 39,900/mo is 1–2 days of profit for a street vendor; DANE counts 507K street-vendor micro-businesses, 94% without RUT — Treinta priced them out and an "alternativa gratuita a Treinta" content industry now farms their churn | Our free-forever catalog + ledger enters exactly where they exited |
| **Complexity creep.** They grew into a POS for gastronomy/retail (recipes, tables, variants, e-invoicing) — built for the *formalizing tienda*, not the informal seller | Our one-screen "Hoy" tally stays simpler than a notebook |
| **Quality debt.** Documented review complaints: update regressions, catalog cache staleness, cart bugs, "cobran bien cobrada la app en relación con las deficiencias" | Reliability on low-end Androids is a feature |
| **Strategic distraction.** New bets are US-facing AI tools, not the Colombian vendedor | A focused solo founder can out-care them in one city |

**Verdict: yes, viable — because we are not actually competing with Treinta.** They sell record-keeping to semi-formal tiendas; we sell *visibility plus* record-keeping to informal vendors they abandoned. The danger scenario isn't Treinta — it's WhatsApp itself adding discovery, which is why we interoperate rather than compete with WhatsApp.

**Should we chase higher-margin sectors instead?** The evidence says: *monetize* vertically, *acquire* horizontally. GlossGenius hit **$100M revenue** on ~96K beauty businesses; Squire hit **$102.5M ARR at $100–250/mo** on just ~2K barbershops. The pattern: **appointment-based services** (beauty, barbers, repairs, food prep-to-order) pay the most because software books their revenue, not just records it — and they have no inventory pain, higher ticket sizes, and repeat clients. Recommendation: keep the free horizontal wedge (any vendor, any sector — that's what fills the marketplace), but build Pro features and pricing around **service vendors first** (open/closed → bookable time slots is a small step with a proven 10× higher willingness to pay). Treat "street food and services have higher margins than reselling goods" as a hypothesis your Pereira/SF interviews must confirm — hard margin-by-sector data doesn't exist publicly.

Sources: [treinta.co/planes-y-precios](https://www.treinta.co/planes-y-precios) · [Play Store Treinta](https://play.google.com/store/apps/details?id=com.treintaapp) · [YC Treinta](https://www.ycombinator.com/companies/treinta) · [idealane launch](https://www.ycombinator.com/launches/Ouc-idealane-where-entrepreneurs-and-smbs-can-build-anything-by-chatting-with-an-ai) · [DANE EMICRON](https://www.dane.gov.co/index.php/estadisticas-por-tema/mercado-laboral/micronegocios) · [GetLatka GlossGenius](https://getlatka.com/companies/glossgenius) · [GetLatka Squire](https://getlatka.com/companies/squire)

---

## 2. Lamppost copy for SF (validation posters)

Target: people selling (or wanting to sell) without a storefront — home cooks, artists, jewelers, bakers, plant people, tamale vendors. Format: big first line, one-line promise, QR + short URL, tear-off tabs. English + Spanish versions for Mission/Excelsior.

**Hook-first (curiosity):**
- "Are you the best empanada maker on your block? **Get paid like it.** → milhojas.vercel.app"
- "Your abuela's recipe deserves customers. Join the waitlist → [QR]"
- "You make it. Your neighbors want it. We connect you. Free."
- "Best paper-plane maker in SF? Weirdly specific talents welcome. Sell what you make → [QR]"

**Pain-first (no storefront / no rent):**
- "No storefront? No problem. Sell to your neighborhood, rent-free → [QR]"
- "A store costs $4,000/month. Your phone is free. Open yours → [QR]"
- "You don't need a shop to be a business."

**Consumer-side variants (test demand too):**
- "The best food in SF isn't in a restaurant. Find what your neighbors are cooking → [QR]"
- "Buy from the lady on your corner, not the algorithm."

**Spanish (Mission/Excelsior):**
- "¿Vendes tamales, arte, postres… sin local? Tus vecinos te están buscando. Gratis → [QR]"
- "No necesitas un local para tener un negocio. Lista de espera → [QR]"

Validation mechanics: use a different URL slug per neighborhood (`/mission`, `/sunset`) so tear-offs measure *where* demand is; the waitlist form asks one question — "What do you sell?" — which doubles as your Phase 0 interview pipeline. Note: postering rules vary by SF district (utility poles are regulated); farmers-market corkboards, laundromats, and cafés are safer and better targeted.

---

## 3. Hyperlocal: "marketplaces die from spreading thin, not from starting small" — examples

**Started absurdly small, won:**
- **Facebook**: one campus (Harvard, 2004), then college-by-college. Dominated each network before opening the next.
- **Craigslist**: literally one city (SF, 1995) — an email list. Expanded city by city only after SF was saturated.
- **DoorDash**: one suburb (Palo Alto, 2013), a few restaurants the founders delivered for themselves.
- **Uber**: SF only for its first year+; launched cities one at a time with dedicated local teams.
- **Nextdoor**: one neighborhood (Lorelei, Menlo Park) as a private pilot before any expansion.
- **Tinder**: seeded at USC parties — one campus's liquidity before anywhere else.
- **Yelp**: SF reviews only, for years, before national coverage meant anything.

**Spread thin, died (your direct cautionary set):**
- **ArtFire, Zibbet, Aftcra, JustArtisan**: national/global artisan marketplaces from day one — supply everywhere, buyer density nowhere; all shut down (2021–2022).
- **Facily** (Brazil): WhatsApp-native group buying, $1.1B valuation, expanded across regions and into owning logistics before nailing one; collapsed under fulfillment complaints.
- **Frubana / Merqueo** (Colombia): multi-city, multi-country B2B/grocery expansion ahead of unit economics; both gone by 2024–25.
- **Groupon**: 48 countries in ~3 years; retreated from most of them.

**Why hyperlocal beats stretching, mechanically:**

1. **Liquidity is local.** A buyer in the Sunset gets zero value from a vendor in San José. 40 vendors in one barrio = a real market; 40 vendors across two countries = an empty app everywhere. Marketplace network effects only compound inside the radius a buyer will travel.
2. **Density is the product.** The consumer promise is "scroll what's near you" — it's only true above a vendors-per-km² threshold. Every new city resets that threshold to zero while splitting your attention.
3. **CAC collapses with density.** In one neighborhood, vendors recruit each other (they share plazas and WhatsApp groups), posters + word of mouth work, and one market visit onboards ten vendors. Spread out, you pay for ads.
4. **Learning speed.** Ten vendors you can visit in person teach you more per week than 1,000 remote signups. Phase 1's exit criteria are only measurable at walking distance.
5. **Defensibility.** A giant can outspend you nationally but won't out-love you in Pereira's Plaza de Bolívar. Local density is the only moat available at $0/month.

The bar: **win one neighborhood until vendors complain that customers come *because* of the app** — then copy the playbook to the next neighborhood, not the next country.

---

## 4. WhatsApp-first: could Milhojas start as a WhatsApp chatbot?

> **Oct 2026 update:** the channel decision is now in `docs/CHANNEL_STRATEGY.md` §0: Milhojas runs on its own platform with its own sign-in and chat. Bots are a later experiment. That doc corrects the Telegram-reach assumption: ~54% monthly use in Colombia, not a fringe app.

Short answer: **yes — it's feasible, near-free, and probably the cheapest possible validation of the marketplace side.** But it complements rather than replaces the app, and one Meta policy shapes the whole architecture.

**What the research says (verified against Meta docs, July 2026):**

- **Cost is ~$0 at MVP scale.** Since July 2025 Meta charges per *template* message only. Everything a user initiates is a free, unlimited "service conversation" — a consumer texting "¿qué hay cerca?" and the bot answering with product lists costs nothing. Business-initiated notifications (e.g., "someone wants your arepas") are utility templates at ≈**$0.0009 each in Colombia** (~$0.90 per 1,000 alerts). Direct Cloud API has no platform fee; the webhook can live in a Supabase Edge Function. No BSP needed.
- **The UX primitives exist in-chat:** interactive list messages (menus of up to 10 options), reply buttons, **location-request messages** (native "share location" button → bot gets lat/lng → answers with what's nearby), WhatsApp Flows (multi-screen forms in-chat — a vendor could log end-of-day sales without ever installing an app), product catalogs with carts (though the catalog belongs to *our* number, so multi-vendor needs pooled catalogs or plain messages).
- **The binding constraint:** Meta's Business Messaging Policy prohibits **forwarding one customer's chat content to another customer**. So the bot cannot be a relay between buyer and seller. The compliant pattern — which happens to be exactly what we already designed — is the **handoff**: bot shows nearby products → buyer taps → bot sends a `wa.me/<vendor>` deep link → buyer and vendor talk in their own private chat → bot separately sends the vendor an opted-in "interest" notification containing no buyer chat content.
- **Other constraints:** 24-hour service window (fine — consumers initiate); human escalation path required (your own WhatsApp suffices at first); Meta Business verification needed to exceed 250 business-initiated contacts/day (2–10 days, start early); **US marketing templates are paused indefinitely** — no proactive promos to SF users, only replies and utility messages (Colombia unaffected — another point for Pereira-first).
- **Precedents:** JioMart ran full grocery shopping on WhatsApp with Meta's blessing (200K+ orders/mo); Yalo does WhatsApp ordering for LatAm corner stores; a whole Colombian cottage industry sells single-vendor "tienda por WhatsApp" bots. **No case found of Meta banning a legitimate marketplace-directory bot.** Failure precedent: Facily died from owning logistics, not from the channel — our connect-and-step-aside model avoids that.

**Recommended shape — hybrid, not either/or:**

| Layer | Role |
|---|---|
| **WhatsApp bot** (Phase 1.5–2) | *Front door.* Consumer discovery ("what's near me") with zero install; vendor interest-alerts; possibly vendor sales-logging via Flows for vendors who resist installing anything |
| **Android app + web** (Phase 1, unchanged) | *System of record.* Catalog management, images, ledger, summaries, offline queue — things chat UX does badly |

Why not WhatsApp-only? The ledger (our habit-forming wedge and future data asset) needs a real UI; the bot's catalog limits and Meta's platform risk (they can change rules any quarter — they've done it twice in two years) make it a channel, not a foundation. Why not skip it? Because a consumer-side MVP in WhatsApp costs a weekend of agent-built webhook code and removes the single biggest adoption barrier — installing an app — in a market where 74% of businesses already sell through WhatsApp.

**Concrete addition to the plan:** insert **"Phase 1.5 — WhatsApp front door"** between Phases 1 and 2: register Cloud API + business verification during Phase 1, ship the location→list→deep-link handoff bot as the *first* consumer surface, and let Phase 2's app/web feed launch only after bot usage proves consumer pull. Its exit criterion: ≥100 consumer conversations/month and ≥15 handoffs to vendors in the pilot neighborhood.

Sources: [Meta pricing](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing) · [Business Messaging Policy](https://business.whatsapp.com/policy) · [location requests](https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/location-request-messages) · [multi-product messages](https://developers.facebook.com/documentation/business-messaging/whatsapp/catalogs/multi-product-messages/) · [US marketing pause](https://help.manychat.com/hc/en-us/articles/19328856186780-Temporary-pause-on-WhatsApp-Marketing-Templates-in-the-US) · [JioMart](https://about.fb.com/news/2022/08/shop-on-whatsapp-with-jiomart-in-india/) · [Yalo](https://techcrunch.com/2021/05/26/yalo-raises-50m-to-build-c-commerce-services-for-chat-apps-like-whatsapp/) · [Facily teardown](https://commercetech.io/p/facily)

---

## 5. The "Tiendanube lesson" explained: fintech take-rate vs. SaaS seats

**SaaS seats** = charging each business a monthly subscription (a "seat"). The problem at the bottom of the market: a vendor earning COP 50K/day can rationally pay COP 10–20K/month — so even at impossible 100% conversion, 1,000 vendors ≈ US$3–5K/month revenue. Treinta's arc proves it: 7M free users, then a forced pivot to COP 39,900+/mo subscriptions that shed exactly the informal users we target. Subscription pricing and mass adoption pull against each other at micro-scale.

**Fintech take-rate** = free software, but the money flows *through* you and you keep a sliver:

- Vendor sells COP 20,000 of arepas, buyer pays through your payment link → you route COP 19,600 to the vendor and keep ~2% (COP 400).
- The vendor pays nothing out of pocket, ever — the cost is invisible, proportional, and only exists when they *earn*. No adoption barrier, perfectly aligned incentives: you make money only when they make money.
- It scales with **GMV, not seats**: 1,000 vendors × COP 100K/day × 2% ≈ US$14K/month — from the same vendors who would never pay a subscription. And payment data (real revenue histories for invisible businesses) later unlocks the genuinely lucrative layer: micro-lending, the model of Nequi-adjacent fintechs everywhere.
- Evidence: **Tiendanube** makes ~35% of its revenue from Nuvem Pago (1.0–3.5% per transaction) rather than store subscriptions; **Square** built a $100B company on 2.6% + 15¢; **Bold** (Colombia) charges no monthly fee, just 2.89%/tx; **Squire/GlossGenius** stack processing fees on top of subscriptions.

**Why flag it for Year 2+, not now:** (1) 2% of nothing is nothing — take-rates need transaction volume, which needs the marketplace to work first; (2) becoming a payment intermediary in Colombia means integrating a licensed aggregator (Wompi, Bold, PayU) or SFC regulatory exposure, and Stripe Connect equivalents in the US — real engineering and compliance; (3) Nequi/DaviPlata person-to-person transfers already work for our vendors — fighting that in Year 1 wastes the wedge. The Year-1 job is owning the *relationship and the ledger*; the Year-2 job is monetizing the money flow you've made visible.

---

## 6. Higher-margin niches for cheap robotics / electronics / software (connected to Q1)

Framing: the Squire lesson is that a tiny TAM with acute pain supports $100M+ ARR at $100–250/mo — **willingness to pay tracks pain-per-dollar-of-revenue, not market size**. Niches below are underserved precisely because they're unglamorous, fragmented, and too small for venture-backed players. Ordered roughly by fit with your skills (software → electronics → robotics). Unverified market-size claims deliberately omitted; validate pain in interviews like Phase 0.

| Niche | Pain | Cheap solution | Why margin/WTP is high | Why unattended |
|---|---|---|---|---|
| **Barbers/beauty solos (LatAm)** | No-shows, WhatsApp appointment chaos | Booking + deposit via Nequi link (software only) | Squire proves $100–250/mo WTP in US; LatAm equivalent (COP 30–60K/mo) is greenfield — Booksy is weak in Colombia | GlossGenius/Squire ignore LatAm; local players do POS, not booking |
| **Coffee fincas (Eje Cafetero — your backyard)** | Drying (secado) is judged by eye; a ruined batch = weeks of income | $30–60 ESP32 + temp/humidity probes in the marquesina/silo + WhatsApp alerts | Specialty coffee premiums are 30–100% over standard; one saved batch pays for years of the device | AgTech targets 500-ha farms; nobody builds for the 1–5 ha campesino. 500K+ coffee families in Colombia |
| **Food-safety temp logging (US)** | Health codes require fridge/freezer temp logs; food trucks/caterers/commissaries do it on paper or lose product overnight | $25 sensor + cellular/WiFi logger + auto-generated inspection PDF | Regulatory-driven = must-pay; one spoiled fridge (~$500–2,000 product) sells the device; US pricing $20–50/mo | Incumbents (SmartSense, Monnit) price for chains ($$$), not the single food truck |
| **Small poultry/egg operations (LatAm)** | Heat spikes kill entire coops; ventilation is manual | Temp/CO₂/ammonia monitor + relay-controlled fan + alert phone call | A single avoided die-off = months of profit; binary catastrophic risk = insurance psychology | Big-ag automation starts at industrial scale |
| **Event/party rental micro-vendors (both markets)** | Double-bookings of inflatables, sound gear, chairs; deposits by memory | Inventory calendar + contract + deposit links (software only) | Ticket sizes $200–2,000/event; a prevented double-booking pays a year of $29/mo | Too niche for Booqable-class players to localize/downmarket |
| **Neighborhood repair techs (appliances, phones, bikes)** | Quotes, parts tracking, warranty dates in their head | Job cards + photo quotes + WhatsApp status updates | Service margins 50–70%; recovering one forgotten warranty callback pays the sub | US field-service SaaS (Jobber, $39+/mo) never localized down-market or to es-CO |
| **Laundromats/lavanderías** | Machine downtime discovered hours later; coin reconciliation | Vibration/current sensor per machine ($10) + uptime dashboard | Each dead machine-day ≈ $30–80 lost; owners are semi-passive investors who love dashboards | US retrofit players charge enterprise prices; LatAm untouched |
| **Cold-chain for street food (Pereira)** | Cheese/meat/dairy vendors lose product on hot days; no proof of freshness for buyers | Cooler probe + "freshness verified" badge in Milhojas listing | Ties directly back into the marketplace as a Pro differentiator — trust sells food | Nobody connects hardware trust signals to hyperlocal commerce |

**Strategic takes:** (1) The beauty/barber and repair-tech rows are *software-only* and could simply be Milhojas Pro verticals — same platform, higher-WTP segment, no new company needed. (2) The coffee-finca row is the standout *hardware* opportunity given your location and engineering background — acute pain, cultural access, zero incumbents, and a natural WhatsApp-alert UX; it could even share Milhojas' rails (vendor identity, payments later). (3) Anything regulatory-driven (food-safety logs) has the highest WTP per dollar of hardware cost but is US-market and compliance-heavy. If Milhojas validation stalls at a gate, rows 1–2 are the most credible pivots that reuse what you'll have built.

---

*Files this connects to: `MILHOJAS_PLAN.md` (master plan — Phase 1.5 addition recommended in §4 above), `docs/PHASE1_PLAN.md` (detailed Phase 1 + AI prompt playbook).*
