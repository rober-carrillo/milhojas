# CLAUDE.md — Milhojas

Instructions for AI coding agents working in this repo.

## What this is
Milhojas: free-tier platform for informal micro-vendors (Pereira, Colombia + SF Bay Area). Vendor-side: product catalog + end-of-day sales ledger. Consumer-side: no-login hyperlocal browse; sign in only to chat with a vendor in Milhojas chat. In-app 1:1 chat is in scope from Phase 1.5. Read `MILHOJAS_PLAN.md` for the roadmap, `docs/ARCHITECTURE.md` for the technical spec, and `docs/CHANNEL_STRATEGY.md` for messaging channels — all binding.

## Hard rules
- Stack is fixed: Expo (mobile) + Next.js (web) + Supabase. TypeScript strict everywhere. No new services, databases, or paid dependencies without explicit owner approval — budget is ~$0/mo.
- Schema changes ONLY via `supabase/migrations/`. Every table keeps RLS enabled. `sales_entries` and `fixed_costs` must never be publicly readable. Never use or expose the `service_role` key in client code.
- Shared logic lives in `packages/core` (types, zod schemas, supabase client, i18n). Never duplicate types inside apps/.
- i18n: Spanish is the source language; every user-facing string goes through i18n (es/en). No hardcoded UI strings.
- Money: numeric/decimal in DB with currency code; no floating-point arithmetic on money in JS.
- Mobile must tolerate offline: sales entries queue locally and sync.
- Chat: conversations and messages are readable only by their participants (RLS). Every chat surface ships with block and report. Users can only message after signing in.
- If a WhatsApp/Telegram adapter is ever built: never relay one user's WhatsApp message content to another user (Meta policy), check `consents` before any business-initiated message, key WhatsApp users on BSUID.

## Scope guard
Do NOT build (yet): WhatsApp/Telegram bot adapters (deferred, see docs/CHANNEL_STRATEGY.md §0), group rooms (Phase 4), payment processing, LLM features, iOS, avatars/virtual market, investment/raffle features. These are gated behind phase exit criteria in MILHOJAS_PLAN.md §2. If a task seems to require them, stop and ask.

## Definition of done
Lint + typecheck + tests green in CI; RLS tests pass; works in Spanish; mobile screens usable one-handed on a low-end Android.
