# Next steps
*Updated October 19, 2026. Phases and gates live in `MILHOJAS_PLAN.md`. Screen mockups: `docs/mockups/screens.png` (image) and `docs/mockups/roadmap.html` (open in a browser).*

## Done
- [x] Master plan, architecture spec and AI build prompts
- [x] Channel decision: own platform, own sign-in and chat (`docs/CHANNEL_STRATEGY.md` §0)
- [x] Private GitHub repo; Mac folder is a clone
- [x] Code structure: web app, Android app, shared core, automatic checks (PRs #1, #2)
- [x] Android app on Expo SDK 57, test APK built on every app change (PR #3)

## To do
- [ ] **Create the Supabase project (free).** supabase.com → Sign in with GitHub → New project `milhojas` → region **East US (N. Virginia)** (can't be changed later) → save the database password. Send Claude the Project URL and the publishable key (formerly "anon"); both are safe to share.
- [ ] **Add two GitHub secrets** so database changes deploy automatically: repo → Settings → Secrets and variables → Actions → `SUPABASE_ACCESS_TOKEN` (Supabase account → Access tokens) and `SUPABASE_DB_PASSWORD`. Never paste these in chat.
- [ ] **Create the Vercel project (free Hobby plan).** vercel.com → Continue with GitHub → Add New → Project → import `rober-carrillo/milhojas` → Root Directory `apps/web` → env vars `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable key) → Deploy. Every pull request then gets its own test link.
- [ ] **Free Expo account** (expo.dev), only needed for Expo Go, which requires sign-in.
- [ ] **Build step P2:** database tables and security rules, with tests and demo Pereira vendors (Claude, after Supabase exists).
- [ ] **Build step P3:** sign-in and business setup, the first version a vendor can try.
- [ ] **Google Play developer account ($25)**, only for the 12-tester closed test. APKs work without it.
- [ ] **Phase 0 interviews** in parallel: 15 vendors, use the mockups to keep them concrete.

## Test it yourself
Both apps currently show only the placeholder home screen. Testing now proves each new screen will reach your phone the same way.

| Way | How |
|---|---|
| **Android APK** | GitHub → Actions → "Android APK" → latest run → Artifacts → `milhojas-android-apk`. Unzip, send the `.apk` to your Android phone, allow installing from that source. Rebuilt on every app change; each kept 30 days. |
| **Expo Go** | Install Expo Go from Google Play and sign in. On the Mac: `git pull && corepack enable && pnpm install && pnpm dev:mobile`, then scan the QR code (same Wi-Fi). Expo Go moves to SDK 58 in a few weeks and will then need the app upgraded; the APK is unaffected. |
| **Web** | On the Mac: `pnpm dev:web` → http://localhost:3000, or the printed "Network" address from a phone on the same Wi-Fi. After Vercel is set up, every change has a shareable link. |

## Open decisions
- **Interviews vs. building:** run the 15 vendor interviews in parallel with the build and let them steer the screens.
- **Buyer sign-in:** email link only, or also "Continuar con Google" (both free)?
