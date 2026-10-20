# Next steps
*Updated October 19, 2026. Phases and gates live in `MILHOJAS_PLAN.md`. Screen mockups: `docs/mockups/screens.png` (image) and `docs/mockups/roadmap.html` (open in a browser).*

## Done
- [x] Master plan, architecture spec and AI build prompts
- [x] Channel decision: own platform, own sign-in and chat (`docs/CHANNEL_STRATEGY.md` §0)
- [x] GitHub repo `rober-carrillo/milhojas`; Mac folder is a clone
- [x] Code structure: web app, Android app, shared core, automatic checks (PRs #1, #2)
- [x] Android app on Expo SDK 57, test APK built on every app change (PR #3)
- [x] Supabase project (East US), GitHub secrets `SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_PASSWORD`
- [x] Vercel project: https://mismilhojas.vercel.app
- [x] Build step P2: database tables, security rules (RLS) with tests, demo Pereira vendors, automatic database deploys
- [x] Build step P3: sign-in (email link or 6-digit code) and business setup on the web, Spanish and English
- [x] Landing page with a live demo: chat, both confirm the order, the walk to the stand and back

## To do
- [x] **Connect a Gmail account as the email sender.** In the Gmail account turn on 2-Step Verification, then create an app password at https://myaccount.google.com/apppasswords. Supabase SMTP form: sender = the Gmail address, name `Milhojas`, host `smtp.gmail.com`, port `465`, username = the full Gmail address, password = the 16-letter app password (never the Gmail password). The "personal email provider" warning is fine at pilot volume.
- [x] **Turn on sign-in emails in Supabase.** Authentication → URL Configuration: Site URL `https://mismilhojas.vercel.app`; Redirect URLs `https://mismilhojas.vercel.app/**`, `https://mismilhojas-*.vercel.app/**`, `http://localhost:3000/**`. Then Authentication → Emails: paste `supabase/templates/sign-in.html` into both "Magic Link" and "Confirm signup", subject `Tu enlace para entrar a Milhojas`.
- [x] **Logo:** line-art milhoja with a wave of top cream; drops into place on the landing page. Files in `docs/brand/`.
- [ ] **Add "Continuar con Google" sign-up** (free). You: Google Cloud project, consent screen "Milhojas", web OAuth client with redirect URL `https://yrnuyhwinrdnzdtchzdw.supabase.co/auth/v1/callback`, then paste its ID and secret into Supabase → Authentication → Providers → Google. Claude: the button and the return page.
- [ ] **Add sign-up by phone (text-message code)** for vendors without email or Google. Paid: about US$0.06 per code to Colombia through Twilio (see `docs/CHANNEL_STRATEGY.md`), so it needs a budget OK. Supabase connects to Twilio directly; WhatsApp codes through Twilio are also possible.
- [ ] **Build step P4:** sign-in and business setup on the Android app, reusing `packages/core`.
- [ ] **Free Expo account** (expo.dev), only needed for Expo Go, which requires sign-in.
- [ ] **Google Play developer account ($25)**, only for the 12-tester closed test. APKs work without it.
- [ ] **Phase 0 interviews** in parallel: 15 vendors, use the mockups to keep them concrete.

## Test it yourself
The website has the landing page, sign-in and business setup. The Android app still shows the placeholder home screen until P4.

| Way | How |
|---|---|
| **Android APK** | GitHub → Actions → "Android APK" → latest run → Artifacts → `milhojas-android-apk`. Unzip, send the `.apk` to your Android phone, allow installing from that source. Rebuilt on every app change; each kept 30 days. |
| **Expo Go** | Install Expo Go from Google Play and sign in. On the Mac: `git pull && corepack enable && pnpm install && pnpm dev:mobile`, then scan the QR code (same Wi-Fi). Expo Go moves to SDK 58 in a few weeks and will then need the app upgraded; the APK is unaffected. |
| **Web** | https://mismilhojas.vercel.app (sign-in works once the Supabase email settings above are done). On the Mac: `pnpm db:start` then `pnpm dev:web` with `apps/web/.env.local` pointing at the local URL and key that `db:start` prints; sign-in emails land at http://127.0.0.1:54324, and the demo vendor is `rosa@demo.milhojas.test`. |

## Open decisions
- **Interviews vs. building:** run the 15 vendor interviews in parallel with the build and let them steer the screens.
- **Buyer sign-in:** email link only, or also "Continuar con Google" (both free)?
