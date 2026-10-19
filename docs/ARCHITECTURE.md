# Milhojas — Technical Architecture (MVP, Phase 1–2)

Spec for AI coding agents and human contributors. Keep it boring, free-tier, and TypeScript-only.

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Mobile (Android) | Expo SDK (React Native, TypeScript) | EAS free tier; local builds via `npx expo run:android` |
| Web (consumer + vendor admin, installable PWA, primary surface) | Next.js (App Router, TypeScript) | Deployed on Vercel Hobby (`milhojas.vercel.app`) |
| Backend | Supabase free tier | Auth, Postgres, Storage, RLS. No custom server in Phase 1 |
| Shared code | `packages/core` in a monorepo (pnpm workspaces or Turborepo) | Types, Supabase client, zod schemas, i18n strings |
| CI | GitHub Actions | Lint + typecheck + test on PR; Vercel auto-deploys web; EAS build on tag |

## Monorepo layout

```
milhojas/
  apps/
    mobile/        # Expo app
    web/           # Next.js app
  packages/
    core/          # shared types, supabase client, zod schemas, i18n (es/en)
  supabase/
    migrations/    # SQL migrations (source of truth for schema)
    seed.sql
```

## Data model (Postgres)

```sql
-- profiles: 1:1 with auth.users
profiles(id uuid PK -> auth.users, role text check in ('vendor','consumer','admin'),
         display_name text, phone text, locale text default 'es', created_at)

businesses(id uuid PK, owner_id uuid -> profiles, name text, description text,
           category text, lat double, lng double, is_open boolean default false,
           whatsapp text, image_url text, created_at)

products(id uuid PK, business_id uuid -> businesses, name text, price numeric,
         cost numeric null,          -- optional cost per unit
         image_url text, is_active boolean default true, sort_order int, created_at)

sales_entries(id uuid PK, business_id uuid -> businesses, product_id uuid -> products,
              units int, sold_on date, created_at)
  -- end-of-day tally; revenue = units*price snapshot, profit = units*(price-cost)
  -- store price_at_sale numeric and cost_at_sale numeric to freeze history

fixed_costs(id uuid PK, business_id uuid, label text, amount numeric, period text) -- Phase 3

-- Milhojas chat (Phase 1.5+). Our own channel; WhatsApp/Telegram adapters are deferred.
conversations(id uuid PK, kind text check in ('direct','group') default 'direct',
              business_id uuid -> businesses, product_id uuid -> products null,
              status text check in ('open','closed') default 'open',
              outcome text check in ('sold','not_sold') null,   -- "¿Se concretó la venta?"
              last_message_at timestamptz, created_at)
conversation_participants(conversation_id uuid, profile_id uuid -> profiles,
              role text check in ('consumer','vendor','admin'), last_read_at timestamptz null,
              PK(conversation_id, profile_id))
messages(id uuid PK, conversation_id uuid, sender_id uuid -> profiles,
         body text check (length(body) between 1 and 2000),
         client_id uuid unique,       -- idempotency key for offline resend
         created_at)
blocks(blocker_id uuid -> profiles, blocked_id uuid -> profiles, created_at, PK(blocker_id, blocked_id))
reports(id uuid PK, reporter_id uuid, message_id uuid null, conversation_id uuid null,
        reason text, status text check in ('open','reviewed') default 'open', created_at)
push_subscriptions(id uuid PK, profile_id uuid, kind text check in ('webpush','expo'),
                   token jsonb, created_at)

-- Deferred until a bot adapter is approved (docs/CHANNEL_STRATEGY.md §0):
-- channel_identities, consents, channel_capabilities, leads
```

Chat is delivered live through Supabase Realtime (Postgres changes on `messages`, filtered by RLS). Free tier: 200 simultaneous connections. A blocked user cannot insert messages into conversations with the blocker (enforced in the insert policy).

## Row-level security (non-negotiable)

- `businesses`, `products` (active), business public fields: `SELECT` for `anon` (consumer browse needs no login).
- All writes: owner only — `owner_id = auth.uid()` via the business join.
- `sales_entries`, `fixed_costs`: owner-only for both read and write. Never publicly readable.
- `conversations`, `conversation_participants`, `messages`: no anon access. Only participants can read; only participants can insert messages, as themselves (`sender_id = auth.uid()`), and not when blocked. `reports`: insert by any signed-in user, read by admins only. `blocks`, `push_subscriptions`: owner only.
- Every table has RLS enabled; no `service_role` key ever ships in app or web client code.

## Key flows

1. **Sign-in (vendors and consumers):** Supabase Auth email magic link; Google OAuth optional (free). Phone/SMS codes cost per message, so they wait.
1b. **Vendor signup:** email magic link (Supabase Auth) → create profile(role=vendor) → create business → add products.
2. **End-of-day tally:** vendor opens "Hoy", sees product list with +/- steppers, saves → one `sales_entries` row per product with `price_at_sale`/`cost_at_sale` snapshots.
3. **Consumer browse (no login):** geolocate (or pick city) → query businesses ordered by distance (Postgres `earthdistance` or simple haversine in SQL view) → rows: "Cerca de ti", categories. Tap → business page → WhatsApp deep link `https://wa.me/<phone>?text=...`.
4. **Chat (Phase 1.5):** consumer taps "Escribir" on a business → signs in if needed (email link) → `start_conversation(business_id, product_id?)` RPC returns the existing open conversation or creates one with both participants → messages insert with a client-generated `client_id` → Realtime pushes to the other side → if they are offline, an Edge Function sends web push / Expo push ("Nuevo mensaje de Ana"). After 48 h of silence the vendor is asked "¿Se concretó la venta?" and the answer goes to `conversations.outcome`.
5. **Web admin = same Supabase, same RLS.** Web and app are equal citizens; anything editable in one is editable in the other.

## Conventions

- TypeScript strict; zod validation at every boundary; DB schema changes only via `supabase/migrations`.
- i18n: es is the source language, en second. No hardcoded strings.
- Images: Supabase Storage, client-side compress to ≤200 KB before upload (1 GB free cap).
- Offline (mobile): queue sales entries locally (AsyncStorage/SQLite) and sync — vendors have bad connectivity.
- Money: store numerics + `currency` char(3) on business ('COP'|'USD'). Never floats in JS — use integer minor units or decimal strings.

## Phase gates (what NOT to build yet)

No WhatsApp/Telegram adapters or group rooms yet, no payments processing, no LLM features, no avatars/virtual market, no iOS — until the plan's exit criteria (MILHOJAS_PLAN.md §2) say so.
