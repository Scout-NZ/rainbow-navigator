# Access Structure & Monetization — July 2026

Synthesis of the founder's Notion notes (Financials 2025, Checklist 2026) and
a market audit of comparable apps (Meetup, Heylo, Geneva, Discord, Facebook
Groups, HER, Grindr, Lex, Everywhere Is Queer, AllTrails, Strava, Untappd,
Yelp). Full audit citations in the research report; key evidence inline.

## 1. The principles (safety first, trust always)

1. **Reading keeps people safe and costs nothing** — not money, and not
   identity. Finding a safe place, a support service, or an event must never
   require an account or a payment.
2. **Writing and connecting require an accountable identity** — check-ins,
   ratings, comments, joining groups, submitting content.
3. **Money never touches trust signals** — no business ever pays to be
   listed, ranked, badged, or rated (the anti-Yelp pledge; also retires the
   2025 "RainbowTik paid certification" idea, which matches the paid-
   certification model the community demonstrably distrusts).
4. **Nobody pays to be IN community** (Discord's rule) — group *members*
   never pay; charging attendees is Meetup's canonical 2019 disaster.
5. **Supporter framing over paywall framing** — Lex, Untappd and Discord
   show community apps earn goodwill (and comparable revenue) from "keep
   this queer-owned and ad-free" rather than gating. Koha culture makes
   this framing native to Aotearoa.

## 2. Access matrix

| Capability | Logged out | Logged in |
|---|---|---|
| Map, places, categories, marker details | ✅ | ✅ |
| Rainbow ratings (view) | ✅ | ✅ |
| Events calendar (view) | ✅ | ✅ |
| Groups directory (view, incl. contact links) | ✅ | ✅ |
| Safety page, support services | ✅ | ✅ |
| Community feed (view) | ✅ | ✅ |
| Report a place (safety) | ✅ anonymous allowed | ✅ |
| Save places | — | ✅ |
| Check in | — | ✅ |
| Rate a place / comment | — | ✅ |
| Join a group | — | ✅ |
| Suggest places / add events / add groups | — | ✅ |
| See other members / profiles | — | ✅ (members only) |
| Future: posts, photos, messaging | — | ✅ (+ moderation) |

## 3. Authentication hardening

Requiring Google-only sign-in would harm exactly the people with most at
stake: closeted users often avoid linking their real-identity Google account
to queer apps. The plan keeps choice while raising the floor:

- Google (and later Apple) OAuth as the promoted default
- Email sign-up stays, but hardened: mandatory email verification,
  minimum password strength, leaked-password protection (Supabase native)
- Optional TOTP two-factor for any account, encouraged for admins
- Admin/moderator accounts: 2FA required
- Session hygiene: refresh-token rotation (Supabase default), sign-out
  everywhere from profile
- Future community features (posts, DMs) can require step-up verification
  without changing the base model

## 4. Monetization structure — two SKUs, nothing else

### SKU 1 — Supporter (consumer, koha-framed)
- **NZ$4.99–6.99/month, pushed annual NZ$49.99/year** (GST-inclusive) —
  the AllTrails+/Untappd/Nitro band; well under NZ "streaming tier" prices
- Framed as *supporting the platform*, with comfort perks — never access:
  - Offline map areas (AllTrails' proven hook)
  - Personal stats: check-in history, places visited, streaks, badges
  - Supporter flair on profile (visible pride in supporting)
  - Custom app icons / theme options
  - Early access to new features; supporter polls on roadmap
  - Calendar sync/export for events
- Never gated (HER's lesson): discovery, search, filters, viewing anything,
  joining anything, safety features

### SKU 2 — Group organiser plan (the Facebook/WhatsApp escape)
- **Free for small groups** (up to ~50 members) — most volunteer-run
  groups pay nothing, ever
- **NZ$19/month or NZ$190/year flat per group** above that ("cheaper than
  Meetup, fairer than Facebook") — the market gap is real: Meetup is
  ~US$25–50/mo and post-2024 widely resented; Circle/Mighty start at
  US$79–89/mo and target paid creators
- What it buys (built from Facebook admins' documented pain):
  - Events with RSVPs, reminders, waitlists
  - Announcements that reach every member (no algorithm, ever)
  - Member management, joining questions, moderation tools with human recourse
  - No ads in their community space
  - **Member-list export on every tier including free** — the anti-lock-in
    promise Meta never makes; state it loudly
  - Later growth lever: optional payment collection (koha, dues, tickets)
    with a small platform percentage (Heylo model) instead of raising fees
- Never: per-member or per-RSVP pricing (Meetup 2019), abrupt repricing
  (Meetup 2024)

### Explicitly not doing
- Business-paid listings, placement, badges, or certification (Yelp/Rainbow
  Tick anti-patterns). If businesses want to give money: clearly-labelled
  sponsorship (Pride-sponsor style), never placement or status.
- Advertising in community spaces
- Multiple consumer tiers (even AllTrails ran a decade on one)

## 5. Fit with the Notion funding phases

Subscriptions are the *Phase 3* income stream, exactly as the Checklist
already planned ("decide when to introduce subscriptions" post-pilot):

- **Phase 1–2 (now)**: free app + grants (Rule Foundation, Creative
  Communities, Lottery; Rainbow Trust next window) + council pilot. The
  access matrix and secure auth land now; payments do not.
- **Phase 3 (post-pilot)**: introduce the Supporter plan first (lowest
  risk, no community dependency), then the organiser plan once ≥ a handful
  of groups actively run events through the app. City contracts and
  institutional subscriptions (councils, universities, DHB successors)
  remain the largest single revenue line per the Notion plan — the two
  SKUs complement, not replace, that strategy.
- Donations/koha button (Givealittle or in-app) can land any time —
  culturally native and zero trust risk.

## 6. Implementation order (when the time comes)

1. Access matrix enforcement pass (RLS already covers most; UI affordances
   for logged-out visitors: "sign in to save/check in/join")
2. Auth hardening: enable leaked-password protection + email verification
   enforcement + TOTP; require 2FA on admin accounts
3. Stripe integration (Supabase + Stripe subscriptions) behind a feature
   flag; Supporter SKU only
4. Organiser tooling (announcements, RSVPs, member export) — this is real
   product work and the price justification; build before charging
5. Public pricing page with the anti-Yelp pledge and "what stays free
   forever" list — the trust document is part of the product
