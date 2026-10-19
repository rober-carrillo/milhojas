# Phase 1 — Vendor MVP: Detailed Plan

Goal (from MILHOJAS_PLAN.md): web platform first, Android app on the same database. Each screen is built on web, checked against its "done when", then ported to Android. Vendors can sign up, create a business, add/edit/remove products, and log end-of-day sales. Cost: $0/mo + $25 Play fee. Duration: ~12 weeks.

## Scope

**In:** magic-link auth · vendor profile + business setup · product CRUD (name, price, optional cost, image) · "Hoy" end-of-day tally with price/cost snapshots · today/week/month summaries · offline queue for sales entries · es/en i18n · Play closed testing.

**Out (do not build):** consumer feed, search, payments, LLM anything, iOS. Chat and notifications come right after, in Phase 1.5 (see MILHOJAS_PLAN.md).

## Week-by-week

| Weeks | Work | Done when |
|---|---|---|
| 1 | Monorepo scaffold (Expo + Next.js + packages/core), Supabase project, GitHub Actions CI, **create Play developer account ($25) + start recruiting 12 testers** | CI green on hello-world in both apps |
| 2 | SQL migrations (profiles, businesses, products, sales_entries), RLS policies, RLS test suite, seed data | RLS tests prove: anon reads products, anon cannot read sales_entries, vendor A can't touch vendor B |
| 3–4 | Auth (email magic link) + onboarding flow on web and mobile: profile → business (name, category, WhatsApp, city/pin) → empty product list | New user reaches empty product list in <2 min on both surfaces |
| 5–6 | Product CRUD on both surfaces; image pick → compress ≤200 KB → Supabase Storage; optimistic UI | A test vendor adds 5 products unassisted in <10 min |
| 7–8 | "Hoy" tally screen (steppers, running profit total, one-tap save, snapshots), summaries screen, **offline queue + sync** (airplane-mode test) | Entry saved offline appears in web after reconnect |
| 9 | Polish: empty states, error states, Spanish copy review by a native speaker, low-end Android test (throwaway $80 device or emulator throttling), accessibility pass (font size, one-handed) | Every screen usable one-handed, Spanish reads natural |
| 10 | Instrumentation (simple `events` table: signup, product_added, tally_saved), Play closed testing upload, tester onboarding — **the 14-day closed-test clock starts here at the latest** | 12 testers installed and active |
| 11–12 | Onboard 10 real pilot vendors **in person** (Pereira plazas / SF markets), watch them use it, fix the top 5 friction points, weekly usage dashboard (SQL query is enough) | Pilot vendors logging sales without you present |

## Exit criteria (gate to Phase 2)

- 10 vendors logging sales ≥3 days/week for 4 consecutive weeks (measure from `sales_entries`, not opens).
- New-vendor task success: 5 products listed unassisted in <10 minutes.
- Crash-free rate >99% on pilot devices; offline sync loses zero entries.

## Risks

- **Play personal-account gate** (12 testers × 14 days before production) — mitigated by starting week 1; testers come from Phase 0 interviewees. The web app is the fallback distribution if Play delays.
- **Supabase free-tier pausing** (1 week inactivity) — you'll be active daily; add a weekly CI ping job anyway.
- **Vendor drop-off after novelty** — the week 11–12 in-person loop exists precisely to find why; the tally must be faster than the notebook or you lose.

---

## Phase 1 prompt playbook (run these against your AI coding agent, in order)

One prompt = one session = one PR. Agent must read `CLAUDE.md` and `docs/ARCHITECTURE.md` first. CI green + RLS tests passing before merging each.

**P1 — Scaffold**
> Create a pnpm monorepo per docs/ARCHITECTURE.md: apps/mobile (Expo TypeScript), apps/web (Next.js App Router TypeScript), packages/core (shared types, zod schemas, supabase client factory, i18n es/en with es as source). GitHub Actions: lint + typecheck + test on PR. Add .env.example (SUPABASE_URL, SUPABASE_ANON_KEY). No secrets committed.

**P2 — Schema + RLS**
> Write supabase/migrations for profiles, businesses, products, sales_entries (with price_at_sale, cost_at_sale) per docs/ARCHITECTURE.md. Enable RLS everywhere: anon SELECT on businesses + active products only; owner-only writes; owner-only read/write on sales_entries. Add seed.sql (3 businesses, 12 products). Write automated RLS tests covering: anon reads products; anon denied on sales_entries; vendor A denied on vendor B's rows.

**P3 — Auth + onboarding (web)**
> Implement Supabase email magic-link auth in packages/core and a web onboarding flow: signup → profile (role=vendor) → business form (name, category, WhatsApp number with country code, city picker + optional map pin) → product list (empty state with clear CTA). Spanish-first, all strings through i18n.

**P4 — Auth + onboarding (mobile)**
> Port P3's flow to apps/mobile using the same packages/core logic. Magic link must work via deep link back into the Expo app. Screens thumb-reachable one-handed; test on a 5-inch, low-RAM Android profile.

**P5 — Product CRUD (web)**
> Build product management in apps/web: list, add, edit, deactivate, delete. Fields: name, price, optional cost, image. Image upload: client-side compress to ≤200 KB, Supabase Storage, public bucket for product images. Optimistic UI with rollback on error. Zod validation from packages/core.

**P6 — Product CRUD (mobile)**
> Port P5 to mobile with expo-image-picker + compression. Target: a first-time vendor adds 5 products in under 10 minutes — count taps per product and minimize; prefill price keyboard as numeric with COP/USD formatting from the business currency.

**P7 — "Hoy" tally + summaries (mobile-first)**
> Build the end-of-day tally: today's active products with +/- unit steppers, live revenue and profit totals, one-tap save writing one sales_entries row per product with price/cost snapshots. Editing the same day updates rather than duplicates. Then summaries: today/week/month revenue, profit, units by product. Largest touch targets in the app; must be usable in direct sunlight (high contrast).

**P8 — Offline queue**
> Make sales entry work fully offline on mobile: queue writes locally (SQLite via expo-sqlite), show sync status, flush on reconnect with idempotency keys so retries never duplicate rows. Write a test simulating: log offline → kill app → reopen online → exactly one set of rows in Supabase.

**P9 — Instrumentation**
> Add a minimal events table (user_id, event, properties jsonb, created_at) with owner-only insert, and log: signup_completed, business_created, product_added, tally_saved, app_opened. Add a SQL view weekly_active_vendors (vendors with ≥3 tally days in the last 7). No third-party analytics.

**P10 — Release plumbing**
> Configure EAS build (internal + production profiles), Android signing, and a GitHub Action triggering an EAS internal build on version tags. Write docs/RELEASE.md covering Play Console closed-testing steps (12 testers/14 days on personal accounts), versioning, and OTA-update policy (JS-only fixes via expo-updates, native changes via new build).

**P11 — Polish sweep (non-code prompt, any capable AI)**
> Here are screenshots + the es string catalog of my vendor app for Colombian informal vendors. Review as (a) a UX writer: make every Spanish string shorter, warmer, and colloquial-Colombian where appropriate; (b) a first-time smartphone user: list every moment of confusion. Return a prioritized fix list.

**P12 — Pilot kit (non-code prompt)**
> Write me: (1) a 60-second Spanish onboarding script to enroll a market vendor in person; (2) a WhatsApp message inviting Phase 0 interviewees to be Play testers, es + en; (3) a Google Play store listing (title ≤30 chars, short + full description, es-CO and en-US) for Milhojas, emphasizing free catalog + daily profit tally. No feature promises beyond Phase 1 scope.
