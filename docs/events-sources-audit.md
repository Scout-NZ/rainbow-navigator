# Events Sources Audit — July 2026

Research into which NZ event sources can feed an automated weekly rainbow-events
import (Supabase edge function on a cron, events land as `pending` for admin
approval, `source` field records provenance).

Endpoints marked *(verify)* were inferred from platform signatures during the
audit and must be confirmed with a direct request from production before
building against them.

## Tier 1 — weekly automated import

| Source | Access | Why |
|---|---|---|
| **Eventfinda** | Official free API, `api.eventfinda.co.nz/v2/events.json`, HTTP Basic auth, 1 req/sec | The only NZ platform with keyword + location event search in 2026. ToS allows display with attribution ("Powered by Eventfinda" + link back per event). Apply for credentials at eventfinda.co.nz/api/v2/index. Sweep ≈ 6 keywords (pride, queer, lgbt, rainbow, drag, takatāpui) × 4 scopes (Auckland, Wellington, Christchurch, nationwide). Dedupe on Eventfinda event id. |
| **Christchurch Pride** (chchpride.co.nz) | WordPress + The Events Calendar plugin: `/wp-json/tribe/events/v1/events` or `/events/?ical=1` *(verify)* | Real year-round structured calendar; JSON/iCal, no text extraction needed. Cheapest win. |
| **Humanitix host pages** | `events.humanitix.com/host/theta-project`, `events.humanitix.com/host/burnett-foundation-aotearoa`; JSON-LD on event pages *(verify)*. Alternative: orgs share events with a Rainbow Navigator Humanitix account → official API `GET api.humanitix.com/v1/events` with `x-api-key` | De-facto ticketing home for NZ queer orgs. One scraper covers Theta Project (PROPAGANDA, HOMO HOUSE — Auckland nightlife) and Burnett Foundation (Big Gay Out), extensible to any org that tickets there. The account-sharing model is fully official and builds relationships. |
| **YOUR EX / Gay Express** (gayexpress.co.nz) | WordPress RSS `/topics/events/feed/` or `/wp-json/wp/v2/posts` *(verify)* | NZ's only national year-round queer publication (rebranded from "express" to "YOUR EX"). Editorial prose, so needs an extraction step (article → event fields) + human review — but it's the best national discovery signal. |

## Tier 2 — seasonal automation (cron-gated)

| Source | Window | Access |
|---|---|---|
| **Auckland Pride** | Dec–Mar (~190 events) | Programme on aucklandpride.org.nz + aucklandpride.ssboxoffice.com — check for JSON XHR behind the listing *(verify)* |
| **Wellington Pride Festival** | Jan–Mar (~90 events) | Live domain is **wellingtonpridefestival.com** (Squarespace) — try `/events?format=json-pretty` *(verify)*. Parade: wellingtonprideparade.co.nz (7 Mar 2027 already announced) |

## Tier 3 — quarterly manual sweep

- **Dunedin Pride** (dunedinpride.org.nz, Shopify, announcements Instagram-first) — encode the recurring Pride Night (last Friday monthly) as a fixture
- **InsideOUT Kōaro** (insideout.org.nz) — low event volume; Schools' Pride Week each June
- **RainbowYOUTH** social groups — model as recurring directory entries, don't scrape
- **Gender Minorities Aotearoa** (genderminorities.com) — WordPress RSS is cheap enough to add to the weekly poll; Wellington drop-in fixtures are static
- **Pride Pledge Rainbow Calendar** (pridepledge.co.nz/rainbow-calendar) — annual festival dates PDF each November; ideal yearly seed of festival windows
- **QLIST** (qlist.app) — nightlife cross-check for Auckland/Wellington
- **Te Ngākau Kahukura** org directory — for discovering new event publishers

## Not usable / retired

- **Eventbrite** — public event search API removed Feb 2020, never restored; ToS prohibits scraping (litigated). Only per-organiser feeds with consent (`/v3/organizations/{id}/events/`).
- **iTICKET / Moshtix / Ticket Fairy** — B2B/organiser APIs only, thin rainbow coverage.
- **UnderTheRadar** — optional gig-guide extra via its `showPanelListAjax.php` fragment endpoint; unofficial, ask permission first.
- **Rainbow Connect NZ** — site closed; removed from source list.
- **Winter Pride Queenstown** — on hiatus 2026, returns 2027; re-add mid-2027.

## Notes

- "thetaproject" = **Theta Project**, Auckland's largest LGBTQIA+ event production
  company (est. 2013) — not a trans org.
- Pipeline design: importer writes to `events` with `status='pending'` and
  `source` set; nothing goes live without admin approval; dedupe on
  source-native event id (Eventfinda id, Humanitix id) falling back to
  title+date match.
