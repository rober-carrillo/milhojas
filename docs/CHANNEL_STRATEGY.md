# Channel Strategy — Beyond the WhatsApp Group Wall
*September 2026, decision updated October 18, 2026 (§0). Supersedes `WhatsApp_Bot_Flow_and_Tradeoffs.pptx` (July 2026) where they conflict. Facts re-verified against official docs this month; sources at the bottom.*

## 0. Decision update (October 18, 2026): our own platform first

**This section replaces the recommendation in §4.** The analysis in §1–3 is kept as a record.

The owner's priorities changed the answer. Control matters more than speed to launch, a longer build is acceptable, and installing an app (or opening a website) isn't treated as a deal-breaker. So:

1. **Milhojas runs on its own platform.** A website first (installable as a web app), then the Android app on the same backend.
2. **Our own sign-in and chat.** Supabase Auth on our Postgres database, and chat as tables in that database with live updates through Supabase Realtime. We own the users, the conversations and the data. No Meta or Telegram rules apply.
3. **Bots are a later experiment, not the foundation.** If testing shows people won't come to the platform, or vendors miss messages, we test a WhatsApp or Telegram bot that talks to the database and platform we already have. The cheapest version is a content-free nudge: "Tienes un mensaje nuevo en Milhojas →" (allowed on WhatsApp as a utility message, about $0.0009 each in Colombia; free on Telegram).

**What we accept with this choice**
- **Empty rooms are the main risk.** Chat only works if the other person is there. We fight it with density: one barrio, vendors onboarded in person, consumers recruited around them, later the scheduled fairs.
- **Notifications are weaker than WhatsApp's at first.** Web push works in Android browsers (most devices in Pereira). On iPhone it works only after the user adds the site to the home screen. The Android app fixes this for vendors.
- **We carry moderation.** Block and report ship with the first version of chat.

**What this changes:** in-app 1:1 chat moves to Phase 1.5 (it used to depend on triggers). Group rooms stay in Phase 4 (fairs). The WhatsApp/Telegram adapters, consent and identity tables are deferred. MILHOJAS_PLAN.md, ARCHITECTURE.md, CLAUDE.md and AI_BUILD_PROMPTS.md were updated to match.

## 0a. The original question

WhatsApp is limiting for groups. Four ways forward were on the table:

1. **Stay as-is:** a WhatsApp 1:1 directory bot that hands buyers off to vendors (the current Phase 1.5 design).
2. **One dedicated Milhojas number as the orchestrator:** a single bot that talks to everyone (consumers, vendors, eventually admins) and coordinates between them.
3. **Move to another messaging platform:** in practice Telegram, the only mainstream one where bots can live inside groups.
4. **A full Milhojas platform with its own chat.**

**Short answer:** don't pick one channel. Make **the Milhojas backend the orchestrator** and treat WhatsApp, Telegram and in-app chat as interchangeable adapters. A "dedicated number" is the right *face* for the orchestrator on WhatsApp. But on WhatsApp it can't do the two things you want most: live in groups, or relay messages between people. Telegram and our own chat can do both. So the orchestration logic has to live in our backend and not inside any one app.

---

## 1. What changed since the July deck

| July deck said | What's true now (Sept 2026) | Consequence |
|---|---|---|
| Telegram is "a minority app in Colombia; most vendors would need to install it" | **53.8% of Colombian internet users (16+) use Telegram monthly** (We Are Social/Meltwater via Branch, Oct 2025). WhatsApp: 91.9%. | Telegram is a real option in Pereira, not a fringe experiment. Still weak in the US. |
| Bots can't join existing WhatsApp groups | Still true. Groups API: **business-created groups only, max 8 participants**, Official Business Account (green check) required, **no interactive messages** in groups. | No change: groups are closed to us on WhatsApp. |
| No relaying chats between customers | Still true, verbatim: *"You may not forward or otherwise share information from a customer chat with any other customer."* | A WhatsApp bot can't be a free-text middleman between buyer and vendor. |
| (not covered) | **Jan 15 2026 Meta AI rule:** general-purpose AI assistants are banned from the WhatsApp Business API. Task-specific business bots are still allowed. | An LLM-powered Milhojas bot is fine as long as it stays scoped to Milhojas tasks (find vendors, orders, "¿cuánto gané?"). It must not be an open-ended chat companion. |
| (not covered) | **WhatsApp usernames + business-scoped user IDs (BSUID)** rolling out from June 2026. New users may reach the bot without sharing a phone number. | Key user identity on BSUID, not phone. Vendor `wa.me` handoff links still work, since those use the vendor's own public number. |

---

## 2. The four options compared

| | ① WhatsApp 1:1 handoff bot (current) | ② One Milhojas number as orchestrator | ③ Telegram bot | ④ Own platform + chat |
|---|---|---|---|---|
| **What it is** | Directory bot: consumer asks → nearby list → `wa.me` link to vendor | Same number serves consumers **and** vendors: discovery, leads, open/closed, sales logging (Flows), order coordination | Bot inside community groups + 1:1; Mini App = Milhojas web app inside Telegram | Rooms ("salas" per plaza/fair), 1:1 buyer–vendor threads, bot as a participant |
| **Reach (Pereira)** | ~92% already have WhatsApp | ~92% | ~54% use it monthly | 0%. Every user is a cold start. |
| **Reach (SF)** | WhatsApp is used by 32% of US adults, higher among Hispanic adults | Same | Low | 0% |
| **Lives in groups?** | ❌ | ❌ (8-person business-created groups only, with OBA) | ✅ Any group; admin/privacy-off bots see all messages | ✅ Our rules |
| **Relays buyer ↔ vendor messages?** | ❌ Handoff only | ⚠️ Not free text. Structured orders with consent are a gray zone (§3) | ✅ No such policy | ✅ |
| **LLM in the loop** | Task-scoped only (Jan 2026 rule) | Task-scoped only | Allowed | Allowed |
| **Rich UI** | Lists (≤10), buttons, location request, Flows | Same | Buttons, inline mode, **Mini Apps (full web app)**, location | Anything |
| **Running cost** | ~$0 (user-initiated service messages are free; utility templates free inside the 24h window, ≈$0.0009 outside it in CO) | ~$0 + templates | $0, no approvals | $0 up to Supabase free Realtime limit (200 concurrent connections), then $25/mo Pro |
| **Platform risk** | Meta changes rules often (AI rule, usernames, pricing in 2 years) | Same, plus the relay gray zone | Lighter governance | None |
| **Build effort (solo + AI)** | ~20–40 h | ~60–90 h | ~30–50 h if the core is channel-agnostic | ~80–140 h for a usable chat (moderation, push, block/report) |
| **Biggest risk** | Can't capture group life | Relay rule; one Meta policy change hits both sides of the market | Vendors not on Telegram → thin supply | Empty rooms: the classic chat cold start |

**About "a phone number as a dedicated bot for everyone" (②):** it's a good idea, and it's already where Phase 1.5 is heading. One number the whole barrio saves as *"Milhojas"* is a strong brand, and vendors can run most of their day from it (open/close, get leads, log sales through WhatsApp Flows) without installing anything. Its limit is on WhatsApp's side: it can **introduce** people, but it **can't sit between them** or **inside their groups**. An SMS number would avoid Meta's rules, but it costs ~$0.059 per outbound message to Colombia on Twilio, has no buttons or lists, and nobody chats with businesses by SMS in Pereira. Rejected.

---

## 3. The relay question, precisely

The orchestrator vision ("the bot passes the message to the vendor and back") collides with one sentence of Meta policy. Here's where the line sits:

| Pattern | WhatsApp status |
|---|---|
| Bot shows vendors → `wa.me` handoff → they chat privately | ✅ Clearly compliant (current design) |
| Bot notifies vendor "someone near you is interested in arepas" (no buyer content, vendor opted in) | ✅ Compliant (utility template) |
| Bot takes a **structured order** (item, qty, pickup time) with the buyer's explicit "send this to Doña Rosa", then sends the vendor an order card | ⚠️ **Gray zone.** This is how delivery marketplaces work, but vendors also chat with our number, so they may count as "customers". **Get written confirmation from Meta or a BSP before building.** A safer variant: vendors use the app or Telegram, not the consumer WhatsApp number. |
| Bot forwards free-text messages back and forth (masked chat) | ❌ Not allowed |
| Bot joins the plaza's existing WhatsApp group | ❌ Impossible via the official API. Unofficial libraries get numbers banned. |

On **Telegram** and **in-app**, every row is allowed.

---

## 4. September recommendation: one orchestrator, three doors (superseded by §0)

```
                 ┌─────────────────────────────────────────┐
                 │  MILHOJAS CORE (Supabase)                │
                 │  identities · consent · conversations    │
                 │  leads/orders · catalog · ledger         │
                 │  Orchestrator (Edge Function):           │
                 │  intent → action → reply per channel     │
                 └──────┬───────────────┬──────────────┬────┘
                        │               │              │
          WhatsApp adapter      Telegram adapter    In-app adapter
          (reach: 1:1 only)     (groups + relay)    (fairs, full control)
```

1. **WhatsApp = reach.** Keep ② (one Milhojas number) as the main door in Pereira. Consumers get discovery and handoff; vendors get leads, open/closed and Flows-based sales logging. Don't relay free text.
2. **Telegram = the group experiment, upgraded from "weekend probe" to a real pilot.** With 54% monthly use in Colombia, pick 1–2 existing community or vendor groups willing to add the Milhojas bot. The bot reads offers ("hoy tengo tamales"), turns them into structured listings with the vendor's OK, and answers "¿quién vende almuerzo cerca?" in the group. This is the "organize the group chat" vision, and Telegram is the only mainstream place it's legal and free.
3. **Own chat = the destination, built on data rather than hope.** Make `conversations`/`messages` first-class tables now, so in-app chat is an adapter later and not a rewrite. Ship user-facing in-app chat when **either** trigger below fires, and at the latest with Phase 4 fairs.

**In-app chat triggers:**
- The Telegram pilot shows group-organized demand beats 1:1 (≥2× handoffs per active user vs WhatsApp), **or**
- ≥30% of WhatsApp handoffs die because buyers or vendors want to coordinate *inside* Milhojas (measured by the follow-up question "¿se concretó?"), **or**
- Meta rejects or restricts the structured-order pattern.

**Why not go straight to ④:** the plan's own evidence (hyperlocal density, the ArtFire/Zibbet graveyard) says the scarce thing is *people in one place*. Our own chat starts at zero people. The adapters let us borrow WhatsApp's and Telegram's crowds while the core owns the relationships, data and consent. When we move people into Milhojas chat, they arrive with history. They don't arrive to an empty room. When users are away from the app, re-engage them with a *content-free* WhatsApp utility message ("Tienes 1 mensaje nuevo en Milhojas →"). Note that on iPhone, web push only works if the user has added the web app to their home screen, which matters for SF.

---

## 5. What this changes in the plan

| Plan item | Change |
|---|---|
| **Phase 1** | Unchanged (vendor MVP). Add: start Meta Cloud API registration + business verification; create the Telegram bot (free, 5 min). |
| **Phase 1.5** | Renamed **"Orchestrator bot"**: one core, WhatsApp adapter (consumers + vendors on one number) + Telegram adapter piloted in 1–2 groups. Structured orders on WhatsApp only after Meta/BSP confirmation. |
| **Phase 1.5 exit** | Existing: ≥100 consumer conversations/mo, ≥15 handoffs. Added: Telegram pilot result recorded (handoffs per active user vs WhatsApp) and the in-app chat decision made against the triggers above. |
| **Phase 2** | Marketplace feed unchanged. If a trigger fired: in-app 1:1 buyer–vendor threads (web, no install, phone/BSUID-verified), with block/report. |
| **Phase 4** | Fairs use in-app rooms (already planned). The bot joins rooms as a participant. |
| **Scope guard** | "No custom chat" becomes "no user-facing in-app chat until a trigger fires". The tables and adapter interface can be built now. |

## 6. Architecture additions (details in `ARCHITECTURE.md`)

- `channel_identities(user_id, channel, external_id)`: one person, many channels. WhatsApp keys on **BSUID** with phone stored only if given.
- `consents(user_id, channel, category, granted_at, revoked_at)`: opt-in proof per channel and message category (Meta requires it).
- `conversations(kind: 'direct'|'group'|'bot', channel, …)`, `conversation_participants`, `messages`: channel-agnostic log. For WhatsApp only bot↔user messages are stored, never cross-posted.
- `leads` (interest/handoff events) and later `orders` (structured).
- One `orchestrator` Edge Function: normalizes inbound events from `wa-webhook` / `tg-webhook` / app → decides the action → replies through the originating adapter. Channel capabilities live in a table (`can_relay`, `can_group`, `max_list_items`), so the same intent degrades gracefully: on WhatsApp it becomes a handoff, on Telegram and in-app it becomes a relay.

## 7. Open decisions for you

1. **Telegram pilot group(s):** which existing community or vendor group in Pereira would add a bot? This is a relationship question and not a technical one.
2. **Vendor channel:** should vendors talk to the *same* WhatsApp number as consumers (simpler, one brand) or a separate "Milhojas Vendedores" number (keeps the relay gray zone cleaner)? My lean: **same number for Phase 1.5**, and split only if we pursue structured orders.
3. **SF:** WhatsApp reach is partial and Telegram is low, so the SF door is more likely web-first (and in-app chat) than messaging-first. Revisit after Pereira.

---

### Sources
- WhatsApp Business Messaging Policy (relay, opt-in, escalation): https://whatsappbusiness.com/policy/
- WhatsApp Groups API (8 participants, OBA, no interactive messages): https://developers.facebook.com/documentation/business-messaging/whatsapp/groups
- WhatsApp pricing (free service messages; free utility templates inside the service window): https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing
- Jan 2026 AI-provider restriction explained: https://respond.io/blog/whatsapp-general-purpose-chatbots-ban
- Usernames / BSUID: https://developers.facebook.com/documentation/business-messaging/whatsapp/business-scoped-user-ids/ · https://www.ycloud.com/blog/whatsapp-usernames-and-business-scoped-user-ids
- Colombia platform usage (Telegram 53.8%, WhatsApp 91.9%): https://www.larepublica.co/internet-economy/whatsapp-facebook-e-instagram-lideran-el-listado-de-redes-sociales-mas-usadas-en-el-pais-4256298
- US WhatsApp use (32% of adults): https://www.pewresearch.org/internet/2025/11/20/americans-social-media-use-2025/
- Telegram bot features (groups, privacy mode, Mini Apps): https://core.telegram.org/bots/features
- Supabase Realtime limits (free: 200 concurrent connections): https://supabase.com/docs/guides/realtime/limits
- Twilio SMS Colombia ($0.0592/outbound message): https://www.twilio.com/en-us/sms/pricing/co
- iOS web push requires home-screen install: https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide

*Low-confidence items: the Telegram share is survey-based "monthly use" and overstates how many people would chat with a business there. Validate in Phase 0/1 interviews by asking "¿Usas Telegram? ¿En qué grupos?". The CO utility template rate (≈$0.0009) is from the July research; confirm on Meta's rate card before budgeting.*
