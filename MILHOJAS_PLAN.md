# Milhojas — Project Plan
*Prepared July 2026. All prices verified against official sources as of this date; flagged items noted.*

---

## 1. Elevator pitch

**Milhojas is the business layer for people who never had one.** Millions of street vendors, artisans, and micro-merchants run real businesses out of a notebook and a WhatsApp chat. Milhojas gives them, in one app as easy as an Instagram profile: a product catalog with prices and photos, an end-of-day ledger that tells them what they actually earned, and a hyperlocal storefront where nearby customers discover them first. For consumers, it's a Netflix-style scroll of what's available to eat, buy, or request — closest first. Later, it becomes a living market: timed community fairs, direct chat when a stand is "open," and *kismet* — jobs, raffles, and collabs between neighbors and the businesses around them. Formal tools charge $50/month and assume you have an accountant. Milhojas starts free and assumes you have a phone.

---

## 2. Phased rollout plan

Each phase has **exit criteria** — objective marks that must be hit before spending more money or building the next layer. If a phase fails its criteria twice, pivot or stop: that is the point of phasing.

### Phase 0 — Validation groundwork (Weeks 1–4) · Cost: $0
Talk before building.

- Interview 15+ target vendors: farmers-market/street vendors in the Bay Area, tienda owners and artisans in Pereira (WhatsApp calls work). Script: How do you track sales today? What did you earn yesterday — do you know? Would you pay anything for an app that tells you?
- One-page landing (free `*.vercel.app` or `*.pages.dev` domain) with a WhatsApp-link waitlist, in English and Spanish.
- Pick launch market (see §5 — recommendation: **Pereira-first for vendors**).

**Exit criteria:** 15 interviews done · ≥20 waitlist signups · ≥5 vendors saying "I'd use this tomorrow" for a specific feature (write down which one — that's your MVP core).

### Phase 1 — Vendor MVP, web-first (Months 2–4) · Cost: $0/mo + $25 one-time
*Revised Oct 2026: Milhojas runs on its own platform (web first, Android app on the same backend). See docs/CHANNEL_STRATEGY.md §0.* The CRM moat, nothing else. **Web platform first, Android app on the same database.** Both can add, edit, remove products and sign up/edit business owners (your stated MVP requirement).

- Sign-in with Supabase Auth (email magic link, free), vendor profile, product CRUD (name, price, image, optional cost-per-unit).
- End-of-day tally: tap units sold → revenue and profit. Weekly/monthly summary screen.
- The web app is installable (PWA) and keeps tally entries offline until it reconnects.
- Spanish + English from day one.
- Android app: each screen is ported once its web version passes its "done when" check. Closed testing on Google Play (the $25 fee; personal Play accounts need a 12-tester/14-day closed test before production. Recruit testers from Phase 0 interviews.)

**Exit criteria:** 10 vendors who log sales **at least 3 days/week for 4 consecutive weeks** (usage, not signups) · task success: a new vendor lists 5 products unassisted in <10 minutes.

### Phase 1.5 — Milhojas chat (overlaps Phase 1 end) · Cost: ~$0/mo
Our own 1:1 chat between a buyer and a vendor, inside the platform. No WhatsApp or Telegram dependency.
- Consumers browse without an account and sign in only to send a message (email link; Google sign-in optional, also free).
- Vendor inbox on web and app; conversation threads tied to a business and optionally a product ("¿Tienes arepas hoy?").
- Live updates with Supabase Realtime (free tier: 200 simultaneous connections). Notifications via web push (works in Android browsers; on iPhone only after adding the site to the home screen) and Expo push in the app.
- Block and report from day one (required by Google Play for user content), with an admin review list.
- "¿Se concretó la venta?" follow-up after a conversation goes quiet, so we can measure chats that turn into sales.

**Exit criteria:** ≥100 consumer conversations/mo in the pilot neighborhood · ≥15 conversations marked as a sale · median vendor first-reply time < 2 hours. **If vendors miss messages** (>30% of conversations get no reply within a day), test the fallback in docs/CHANNEL_STRATEGY.md §0: a content-free WhatsApp or Telegram nudge ("Tienes un mensaje nuevo en Milhojas") from our own database.

### Phase 2 — Consumer marketplace (Months 4–7) · Cost: $0–25/mo
Only now do consumers arrive in numbers, because a marketplace with no supply is dead on arrival.

- Public, no-login browse feed: cards of nearby products/services, sorted by distance (Netflix-row UX: "Closest to you," "Food," "Artisans," "Services").
- Vendor "open/closed" toggle; **"Escribir" opens Milhojas chat**. A WhatsApp link stays available as a secondary button if the vendor wants it.
- Vendor share cards (image + link) for posting to WhatsApp Status/Instagram. Vendors become your distribution.
- Android app in closed testing with the same screens as the web.
- Upgrade to Supabase Pro ($25/mo) when: >400 MB database, or you need daily backups, or project-pausing becomes a risk.

**Exit criteria:** 25 active vendors · 200 consumer visits/week · ≥30 consumers who return in 2 consecutive months · ≥10 verified vendor–consumer transactions initiated through the app.

### Phase 3 — Monetization test + production release (Months 7–10) · Cost: $25–45/mo
- Production release on Google Play.
- **Freemium split:** free = catalog + daily tally + marketplace listing (forever — this is the acquisition engine). Pro = monthly budgeting, fixed costs, paystub generation, exportable reports, priority placement. Price test: **COP 15,000–25,000/mo (~US$4–6) in Pereira; US$9–15/mo in SF** (see §6 for why these numbers).
- Payments: Stripe (US) / Nequi–DaviPlata manual confirmation or Wompi (Colombia) — do NOT build payment processing into the marketplace itself yet.
- If web traffic is now commercial, move web hosting: Vercel Pro $20/mo **or** Cloudflare (free, commercial use allowed) — decision table in §4.

**Exit criteria:** 40 vendors signed up · 60 recurring monthly consumers (**your end-of-year goal lands here — see feasibility note in §7**) · ≥5 paying Pro vendors · churn of paying vendors <15%/mo.

### Phase 4 — Engagement layer (Months 10–14) · Cost: $45–100/mo
- **Timed sync events v1:** a scheduled "community fair" — a 2-hour window where participating vendors are live-flagged and in-app chat opens. This is the SIMS-market vision reduced to its testable core: does synchronous shopping create demand spikes?
- LLM assistant beta (premium): spoken/typed questions over the vendor's own ledger ("¿cuánto gané esta semana?"), formalization guidance (Colombian RUT/Cámara de Comercio steps, SF vendor permits). API cost is why the ceiling rises; cap tokens per user.
- Fairs run as group rooms on the same Milhojas chat built in Phase 1.5.

**Exit criteria:** 1 fair/month with ≥15 vendors and ≥80 consumer attendees · fair-day transactions ≥3× a normal day · 100+ vendors, 250+ MAU.

### Phase 5 — Kismet + scale (Year 2, post-validation)
Jobs board, raffles, business collabs, micro-investment/volunteering (note: **investment features trigger securities regulation in both countries — get legal advice before building**), avatar/virtual-market UX, second city. Fund from revenue or raise; this phase is out of the $100/mo envelope by design.

### Timeline & cost summary

| Phase | Months | Monthly cost | One-time | Dev effort (solo + AI agents) |
|---|---|---|---|---|
| 0 Validation | 1 | $0 | $0 | ~20 hrs |
| 1 Vendor MVP | 2–4 | $0 | $25 Play fee | ~120–180 hrs |
| 2 Marketplace | 4–7 | $0–25 | $0 | ~100–150 hrs |
| 3 Monetization | 7–10 | $25–45 | ~$15 domain (optional) | ~80–120 hrs |
| 4 Engagement | 10–14 | $45–100 | $0 | ~120+ hrs |
| **Year-1 total** | | **≤ ~$400 cumulative** | **~$40** | |

Well under your $100/mo × 12 = $1,200 budget. The binding constraint is your time, not money.

---

## 3. Recommended stack (and why)

**Expo (React Native) Android app + Next.js web app + Supabase (auth, Postgres DB, storage, row-level security) + GitHub Actions/EAS for CI.**

- One language (TypeScript) across app and web → AI coding agents work dramatically better, and you can share the API client, types, and validation code.
- Supabase free tier: 50K monthly auth users, 500 MB Postgres, 1 GB storage — covers all of Year 1. Postgres + row-level security fits marketplace data (vendors, products, orders are relational) better than Firestore's NoSQL. Caveat: free projects pause after 1 week of inactivity — fine while you're building daily; upgrade to Pro ($25/mo, backups, never pauses) at Phase 2/3.
- Expo free tier: 30 cloud builds/mo, over-the-air JS updates to 1,000 users free — you can push fixes without Play Store review. Local builds are free and unlimited.
- Free domains: `milhojas.vercel.app` / `milhojas.pages.dev` until Phase 3.

---

## 4. Early design decisions (two-column comparisons)

### App-only vs. multiplatform from the start

| Android app only | **Web + Android from day one (recommended)** |
|---|---|
| Faster to first build; one surface to test | You *stated the requirement*: manage DB from web and app. Also: consumers browsing shouldn't need an install |
| Play closed-testing gate delays distribution | Web app is live instantly; app follows |
| Vendors in Colombia are ~79% Android — app-only is viable there | iPhone consumers (majority in SF) are only reachable via web until you pay Apple $99/yr |
| Cheaper if native (no shared code needed) | With Expo + Next.js sharing TypeScript/Supabase, the marginal cost of web is small |

**Decision: multiplatform, shared backend.** The web app doubles as your admin panel in Phase 1.

### Expo (React Native) vs. Flutter

| Flutter | **Expo / React Native (recommended)** |
|---|---|
| Excellent UI performance; free local builds; the ApiceFlow template you found is Flutter (but it's UI-only, 4 stars, a paid-template teaser — not a foundation) | TypeScript shared with the Next.js web app — one codebase mentality, and current AI agents are strongest in TS/React |
| Dart is a second language to maintain alongside your web stack | Expo OTA updates ship fixes without store review (first 1,000 users free) |
| Code-push needs third-party (Shorebird) | EAS handles signing/builds/submission (30 free builds/mo) |

### PWA-only vs. real Android app

| PWA + Play listing via TWA | **Expo native app (recommended, with PWA-quality web)** |
|---|---|
| $0 tooling; one web codebase; installable on Android; can be listed on Play via Trusted Web Activity | Reliable push notifications, camera, offline — daily-ledger UX needs to feel instant and work with bad connectivity (Pereira) |
| Weaker offline story; feels less "real" to vendors — perceived legitimacy matters to this audience | More moving parts |
| **Legitimate fallback** if app development stalls — keep the web app PWA-grade so this door stays open | |

### Supabase vs. Firebase (auth + DB)

| Firebase (Firestore + Auth) | **Supabase (recommended)** |
|---|---|
| 50K free MAU auth; generous Firestore free reads/writes; Google ecosystem | 50K free MAU auth; **real Postgres** — marketplace data is relational (vendors→products→sales) |
| NoSQL: "products near me, sorted by distance, filtered by category" queries get painful and per-read billing punishes feed browsing | Row-level security in SQL = each vendor can only touch their own rows; one policy secures app *and* web |
| Cloud Storage now requires the pay-as-you-go Blaze plan (card on file) | 1 GB storage free, no card; spend cap ON by default on Pro (no surprise bills) |
| Vendor lock-in (proprietary) | Open source; can self-host or migrate the Postgres DB anywhere post-validation |

### Vercel vs. Cloudflare (web hosting)

| **Vercel (recommended to start)** | Cloudflare Pages/Workers |
|---|---|
| Best Next.js DX; free Hobby tier; `*.vercel.app` domain | Free tier allows **commercial use**; unlimited static bandwidth; Workers 100K req/day |
| ⚠️ Hobby tier is **non-commercial only**. Fine for Phases 0–2 (no revenue). At Phase 3 (charging money) → Pro $20/mo | Next.js on Workers is workable but rougher DX |
| Zero-config CI: push to GitHub → deployed | Also free CI via Pages |

**Decision: Vercel Hobby now; at first revenue, choose Vercel Pro ($20/mo) for convenience or migrate to Cloudflare ($0) if the budget is tight that month.**

### Freemium vs. paid-from-start

| Paid from start | **Freemium (recommended)** |
|---|---|
| Immediate validation of willingness to pay | Your competition is **free** (WhatsApp Business, Facebook Marketplace, notebook). A paywall at signup kills adoption with informal vendors |
| Filters for serious users | Free tier = marketplace supply = consumer value. Charge for *insight* (budgeting, reports, LLM), never for *presence* |
| | Benchmark: Treinta (5M+ LatAm micro-businesses) went from free to paid-first (Esencial COP 39,900/mo, Pro COP 79,900/mo as of 2026) — and its churned free users are our acquisition pool. See docs/STRATEGY_NOTES.md §1 |

### Build from template vs. from scratch

| Template (of the 3 repos you listed) | **From scratch with AI agents (recommended)** |
|---|---|
| **Mercur** (MedusaJS marketplace, 1.6k★, active, MIT, even ships CLAUDE.md/llms.txt for AI agents) is genuinely production-grade — worth *reading* for marketplace data-model ideas | Mercur needs Postgres+Redis ops and a Medusa learning curve, and still doesn't cover your differentiator (the daily-ledger CRM) or mobile. ApiceFlow (4★, UI-only teaser) and marketplace-hub (0★, portfolio demo) are not foundations |
| Head start on vendor onboarding/commissions | Your MVP is small enough that AI agents + Supabase get you there faster than learning someone else's architecture. Revisit Mercur if Phase 3+ needs real order/commission management |

---

## 5. Target market comparison: SF Bay Area vs. Pereira

| | SF / Bay Area | Pereira / Eje Cafetero |
|---|---|---|
| Target density | 15 CFMA + 30+ PCFMA farmers markets, 40–150 vendors each; ~230 new SF businesses/mo; sidewalk vending legal (CA SB 946) though SF enforcement tightened in 2025 | ~590K metro population; ~38% labor informality (rising) — tens of thousands of exactly-target vendors; strong artisan/coffee culture |
| Incumbents | Square (free + 2.6%/tx), Shopify Starter ($5/mo), Instagram, Facebook Marketplace — crowded, sophisticated | WhatsApp Business (74% of Colombian businesses sell through it), Treinta (bookkeeping), Rappi (delivery). Nobody combines ledger + hyperlocal discovery |
| Willingness to pay | Higher: $5–49/mo is normal for micro-sellers | Lower: Treinta Pro ~US$16/mo is the ceiling; realistic COP 15–25K (~US$4–6) |
| Payments infra | Stripe/Square trivial | Nequi 13M+ users, DaviPlata ~19M — digital payments mainstream even among unbanked |
| Devices | iPhone-heavy consumers → web matters | ~79% Android → Android-first is correct |
| Your CAC | High: paid channels, saturated attention | Low: vendor WhatsApp groups, plazas de mercado, in-person; peso-denominated marketing budget goes far |
| Regulatory | Vendor permits, sales tax; investment features → SEC | Formalization (RUT) is itself a selling point for your LLM feature; investment features → SFC |

**Recommendation:** **Pereira-first for vendor validation** (cheap CAC, unserved need, your cultural access), while keeping the SF waitlist warm through farmers-market outreach. SF becomes the expansion market where the higher willingness to pay funds the business — but win density in one city first. Hyperlocal marketplaces die from spreading thin, not from starting small.

---

## 6. What will they pay?

Anchors from live products: Treinta Pro COP 69,900/mo (~US$16) in Colombia; Shopify Starter $5/mo, GlossGenius from $24/mo, Square Plus $49/mo in the US.

- **Catalog + marketplace presence: $0, permanently.** WhatsApp and Facebook set the price of presence at zero; you cannot charge for it.
- **Ledger insight (budgeting, reports, paystub): COP 15–25K (~$4–6)/mo in Pereira; $9–15/mo in SF.** This is the Pro tier.
- **LLM assistant + formalization help: bundled into Pro or +$3–5/mo.** Watch API costs.
- Realistic Year-1 revenue at your goals (40 vendors, ~12–20% paid conversion): **5–8 paying vendors ≈ US$25–90/mo.** Year 1 revenue is a validation signal, not income — plan accordingly.

---

## 7. Honest feasibility evaluation

**Your end-of-year targets (40 businesses, 60 recurring monthly users) are achievable** — with founder-led, in-person recruiting in one city, that's ~1 vendor/week and a modest consumer funnel; note my plan places that mark at Phase 3 (~month 10), which is realistic, not padded. The harder truths:

1. **Your real competitor is free and already installed.** 74% of Colombian businesses sell via WhatsApp. Milhojas must *interoperate* (share-to-WhatsApp, WhatsApp contact links) and win on the one thing WhatsApp can't do: tell a vendor what they earned. The daily ledger is your wedge — it creates a private-data habit *before* the marketplace network effect exists. This sequencing is why the plan builds CRM first, marketplace second.
2. **The marketplace side has a graveyard.** ArtFire, Zibbet, Aftcra, JustArtisan all died; no standalone hyperlocal artisan marketplace has verifiably succeeded in the US. Failure mode: vendors join, buyers don't. Mitigation: consumers are Phase 2 not Phase 1, no-login browsing, vendors as distribution, and density in one city before any expansion.
3. **Revenue will be small for a long time.** Treinta raised $60M+ to serve 5M+ users and still monetizes thin. At micro-vendor price points, this becomes a *business* only at thousands of vendors or by taking a cut of payments (the Tiendanube lesson: LatAm SMB platforms monetize via fintech, ~1–3.5% of transactions, not SaaS seats). That is the credible long-term model — flag for Year 2+.
4. **What's genuinely defensible:** the combination (ledger + hyperlocal discovery + community events) doesn't exist in either market; the informal segment is huge, growing, and unserved by design (formal tools assume formal businesses); LLM cost collapse makes a "business advisor in your pocket" viable at these price points for the first time; and end-of-day sales data across a city's informal economy is an asset nobody else has (including, eventually, for the government-visibility goal in your concept doc).
5. **Verdict: worth building — as a staged bet, not a leap.** Probability the Year-1 validation goals are hit: good, if you personally recruit in one city. Probability this becomes a self-sustaining business by end of Year 1: low (as it is for any marketplace at month 12). The freemium wedge → density → payments-cut path is credible and each phase gate caps your downside at ~$400 total spend.

---

## 8. Suggested next steps

1. **This month:** run Phase 0 — 15 vendor interviews (start in Pereira via WhatsApp), landing page with waitlist. Do not write app code yet.
2. Create the Google Play developer account ($25) now — start the closed-testing clock early; recruit the 12 required testers from interviewees.
3. Set up the free stack skeleton (Supabase project, Next.js on Vercel, Expo app) — see `docs/AI_BUILD_PROMPTS.md` in this folder for ready-to-use prompts to have AI agents build each piece, and `docs/ARCHITECTURE.md` + `CLAUDE.md` for the technical spec they should follow.
4. Decide the launch market after interviews (evidence over preference).
5. Re-read this plan at each phase gate; kill or pivot features that miss exit criteria twice.

---

## Appendix — Key sources

Pricing: [Vercel plans](https://vercel.com/docs/plans/hobby) · [Supabase pricing](https://supabase.com/pricing) · [Firebase pricing](https://firebase.google.com/pricing) · [Expo/EAS plans](https://docs.expo.dev/billing/plans/) · [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) · [Google Play fee](https://support.google.com/googleplay/android-developer/answer/6112435)
Market/competitors: [WhatsApp stats](https://www.businessofapps.com/data/whatsapp-statistics/) · [Treinta pricing](https://www.treinta.co/planes-y-precios) · [Treinta @ YC](https://www.ycombinator.com/companies/treinta) · [Colombia informality (DANE via Portafolio)](https://www.portafolio.co/economia/empleo/la-informalidad-laboral-cerro-2025-en-55-7-y-confirma-un-estancamiento-en-la-calidad-del-empleo-488295) · [Pereira informality](https://www.eldiario.com.co/noticias/economia/desempleo-en-pereira-bajo-a-84-en-2025-pero-crece-la-informalidad-laboral/) · [Nequi/DaviPlata](https://fintechnews.am/fintech-colombia/54903/nequi-daviplata-and-movii-dominate-colombias-neobanking-market-but-new-challengers-emerge/) · [SF small business snapshot (JPMC Institute)](https://www.jpmorganchase.com/institute/all-topics/business-growth-and-entrepreneurship/san-francisco-small-business-snapshot) · [CA SB 946](https://en.wikipedia.org/wiki/Safe_Sidewalk_Vending_Act) · [ArtFire shutdown](https://craftindustryalliance.org/artfire-to-shut-down-at-the-end-of-2021/) · [Mercur repo](https://github.com/mercurjs/mercur)

*Low-confidence figures flagged inline by research: WhatsApp country-level selling percentages (vendor blog), Treinta user counts (company-sourced), Facebook Marketplace totals (aggregators).*
