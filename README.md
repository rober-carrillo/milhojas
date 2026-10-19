# Milhojas

The business layer for informal micro-vendors: a product catalog and end-of-day sales ledger for vendors, and hyperlocal no-login discovery for consumers. Pilot markets are Pereira, Colombia, and the SF Bay Area.

## Start here
- `MILHOJAS_PLAN.md`: roadmap, phases, exit criteria, costs
- `docs/NEXT_STEPS.md`: current to-do list, account setup, how to test on your phone
- `docs/mockups/`: screen mockups for the web and Android app
- `CLAUDE.md`: rules for AI coding agents (binding)
- `docs/ARCHITECTURE.md`: technical spec (Expo + Next.js + Supabase)
- `docs/CHANNEL_STRATEGY.md`: messaging channels (WhatsApp / Telegram / in-app orchestrator)
- `docs/PHASE1_PLAN.md`: vendor MVP week by week
- `docs/STRATEGY_NOTES.md`: competitor and market research
- `docs/AI_BUILD_PROMPTS.md`: prompts for building each piece with AI agents
- `Milhojas.pdf`: original concept document
- `WhatsApp_Bot_Flow_and_Tradeoffs.pptx`: July 2026 deck. Partly superseded by CHANNEL_STRATEGY.md.

## Code layout
```
apps/web        Next.js web app (vendor admin now, consumer feed in Phase 2)
apps/mobile     Expo Android app
packages/core   Shared types, zod schemas, money helpers, Supabase client, i18n (es/en)
```

## Run it locally
Requires Node 20.19+ and pnpm (`corepack enable` turns pnpm on).
```
pnpm install
cp .env.example apps/web/.env.local   # fill in Supabase values when the project exists
pnpm dev:web                           # http://localhost:3000
pnpm dev:mobile                        # scan the QR code with Expo Go on Android
pnpm lint && pnpm typecheck && pnpm test
```
CI runs the same checks plus a web build on every pull request.
