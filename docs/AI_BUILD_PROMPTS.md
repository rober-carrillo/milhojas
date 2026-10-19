# Milhojas — AI Build Prompts

Copy-paste prompts for orchestrating AI coding agents (Claude Code, Cursor, etc.), in build order. Each assumes the agent can read `docs/ARCHITECTURE.md` and `CLAUDE.md`. Run them as separate sessions/tasks; commit between steps.

## 0. Repo scaffold
> Create a pnpm monorepo per docs/ARCHITECTURE.md: apps/mobile (Expo, TypeScript, blank template), apps/web (Next.js App Router, TypeScript), packages/core (shared types + zod + supabase-js client factory + i18n es/en). Add GitHub Actions workflow running lint, typecheck, and tests on PR. Add .env.example listing SUPABASE_URL and SUPABASE_ANON_KEY. No secrets in code.

## 1. Database + RLS
> Write Supabase SQL migrations implementing the schema in docs/ARCHITECTURE.md (profiles, businesses, products, sales_entries with price_at_sale/cost_at_sale snapshots). Enable RLS on every table with: public anon SELECT on businesses and active products; owner-only writes; owner-only read/write on sales_entries. Add a `nearby_businesses(lat, lng)` SQL function using haversine returning businesses ordered by distance. Include seed.sql with 3 demo businesses and 12 products. Write RLS tests (pgTAP or a TS test hitting a local Supabase) proving: anon can read products, anon cannot read sales_entries, vendor A cannot edit vendor B's products.

## 2. Auth + vendor onboarding (core package + both apps)
> Implement email magic-link auth via Supabase in packages/core, then vendor onboarding in apps/web and apps/mobile: sign up → create profile(role=vendor) → create business (name, category, WhatsApp number, location via map pin or city picker) → land on product list. Spanish-first UI, English via i18n. Reuse all types/schemas from packages/core.

## 3. Product CRUD (both apps)
> Build product management on web and mobile: list, add, edit, deactivate, delete products (name, price, optional cost, image). Image picker → client-side compression to ≤200 KB → Supabase Storage upload. Optimistic UI. A new vendor must be able to add 5 products in under 10 minutes — minimize taps.

## 4. End-of-day tally + summaries (mobile-first)
> Build the "Hoy" screen: today's product list with +/- unit steppers, running revenue/profit total, one-tap save creating sales_entries with price/cost snapshots. Then a summary screen: today / this week / this month revenue, profit, units by product. Must work offline: queue entries locally and sync when online. This is the most important screen in the product — make it fast and thumb-friendly.

## 5. Consumer browse (web first, then mobile)
> Build the public no-login marketplace feed: geolocation (with city-picker fallback), horizontally scrollable rows ("Cerca de ti", per-category) of product/business cards sorted by distance via nearby_businesses(). Business page: products, open/closed badge, "Chatear por WhatsApp" deep link (wa.me). Add vendor share-card generation (og-image or canvas: business name + product photo + link) for WhatsApp/Instagram sharing. SEO: server-render business pages.

## 5b. Milhojas chat (Phase 1.5)
> Add migrations for conversations, conversation_participants, messages, blocks, reports, push_subscriptions per docs/ARCHITECTURE.md, with RLS and tests: anon denied; non-participants denied; a user can only send as themselves; a blocked user cannot send to the blocker; reports readable only by admins. Add a `start_conversation(business_id, product_id)` RPC that returns the open conversation or creates one. Then build on web (mobile-width first): vendor inbox with unread counts, conversation thread with live updates via Supabase Realtime, "Escribir" button on the business page that asks consumers to sign in only at that moment, block and report actions in the thread menu, and web push for new messages when the tab is closed. Messages carry a client-generated client_id so resends never duplicate. Spanish-first copy.

> Port the inbox and thread to apps/mobile with the same packages/core logic and Expo push notifications.

## 6. Release plumbing
> Set up EAS build config for Android (internal + production profiles), app signing docs, and a GitHub Action that triggers an EAS build on version tags. Document the Play Console closed-testing steps (12 testers / 14 days for personal accounts) in docs/RELEASE.md.

## Later phases (do not run until plan gates pass)
- Phase 3: Pro-tier gating (budgeting, fixed costs, paystub PDF, CSV export), Stripe (US) checkout, priority placement flag.
- Optional, only if vendors miss messages: a WhatsApp or Telegram bot that sends a content-free "Tienes un mensaje nuevo" nudge from our database (see docs/CHANNEL_STRATEGY.md §0).
- Phase 4: scheduled "feria" events table + fair rooms (in-app conversations of kind group); LLM assistant endpoint (server-side, per-user token cap) answering questions over the vendor's own sales data.

## Orchestration tips
- One prompt = one PR. Have the agent write tests before marking done; CI must be green.
- After each step, run the RLS tests again — security regressions are the real risk with agent-written code.
- Keep packages/core as the single source of truth; reject PRs that duplicate types in apps/.
