// Weekly rainbow-events importer.
//
// Pulls LGBT+/rainbow events from external sources and inserts them into
// public.events with status='pending' — nothing appears in the app until an
// admin approves it. Deduped per source via (source, external_id) and across
// sources by normalised title + calendar day.
//
// Sources (see docs/events-sources-audit.md):
//   eventfinda  — official API; needs EVENTFINDA_USERNAME/EVENTFINDA_PASSWORD
//                 secrets, silently skipped until they are set. ToS requires
//                 "Powered by Eventfinda" attribution + per-event link back.
//   chchpride   — The Events Calendar REST API on chchpride.co.nz.
//   humanitix   — host pages for NZ rainbow orgs (Theta Project, Burnett
//                 Foundation); parsed from embedded JSON-LD / __NEXT_DATA__.

import { createClient } from "npm:@supabase/supabase-js@2";

type ImportedEvent = {
  source: string;
  external_id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  city: string | null;
  venue: string | null;
  address: string | null;
  url: string | null;
  price: string | null;
};

type SourceReport = { fetched: number; inserted: number; skipped: number; error?: string };

const EVENTFINDA_KEYWORDS = ["pride", "queer", "lgbt", "rainbow", "drag", "takatāpui"];
const EVENTFINDA_LOCATIONS: (string | null)[] = ["auckland", "wellington", "christchurch-city", null];
const HUMANITIX_HOSTS = ["theta-project", "burnett-foundation-aotearoa"];

const CITY_HINTS: [RegExp, string][] = [
  [/auckland|tāmaki|manukau|takapuna|newmarket|ponsonby|karangahape|britomart/i, "Auckland"],
  [/wellington|te aro|newtown|cuba|courtenay|pōneke/i, "Wellington"],
  [/christchurch|ōtautahi|canterbury/i, "Christchurch"],
  [/dunedin|ōtepoti/i, "Dunedin"],
  [/hamilton|kirikiriroa/i, "Hamilton"],
  [/tauranga/i, "Tauranga"],
  [/palmerston/i, "Palmerston North"],
  [/napier|hastings|hawke/i, "Napier"],
  [/nelson|whakatū/i, "Nelson"],
  [/porirua/i, "Porirua"],
  [/hutt/i, "Lower Hutt"],
];

function guessCity(...fields: (string | null | undefined)[]): string | null {
  const hay = fields.filter(Boolean).join(" ");
  for (const [re, city] of CITY_HINTS) if (re.test(hay)) return city;
  return null;
}

function normTitle(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function clip(s: string | null | undefined, max = 1500): string | null {
  if (!s) return null;
  const clean = s.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&#\d+;|&\w+;/g, " ").replace(/\s+/g, " ").trim();
  return clean ? clean.slice(0, max) : null;
}

// ---------- Eventfinda (official API) ----------
// Credentials come from env secrets if set, otherwise from Supabase Vault via
// a service-role-only RPC (see get_eventfinda_credentials in the database).
async function resolveEventfindaCreds(supabase: any): Promise<{ user: string; pass: string }> {
  const envUser = Deno.env.get("EVENTFINDA_USERNAME");
  const envPass = Deno.env.get("EVENTFINDA_PASSWORD");
  if (envUser && envPass) return { user: envUser, pass: envPass };
  const { data, error } = await supabase.rpc("get_eventfinda_credentials");
  const row = Array.isArray(data) ? data[0] : data;
  if (error || !row?.username || !row?.password) {
    throw new Error("credentials not configured — set env secrets or Vault entries");
  }
  return { user: row.username, pass: row.password };
}

async function fetchEventfinda(supabase: any): Promise<ImportedEvent[]> {
  const { user, pass } = await resolveEventfindaCreds(supabase);
  const auth = "Basic " + btoa(`${user}:${pass}`);
  const today = new Date().toISOString().slice(0, 10);
  const horizon = new Date(Date.now() + 120 * 86400_000).toISOString().slice(0, 10);
  const out: ImportedEvent[] = [];
  for (const kw of EVENTFINDA_KEYWORDS) {
    for (const loc of EVENTFINDA_LOCATIONS) {
      const params = new URLSearchParams({
        q: kw,
        start_date: today,
        end_date: horizon,
        rows: "20",
        fields: "event:(id,url,name,description,datetime_start,datetime_end,location_summary,address,is_free)",
      });
      if (loc) params.set("location_slug", loc);
      const res = await fetch(`https://api.eventfinda.co.nz/v2/events.json?${params}`, {
        headers: { Authorization: auth },
      });
      if (!res.ok) throw new Error(`eventfinda ${res.status} for q=${kw}`);
      const data = await res.json();
      for (const ev of data.events ?? []) {
        if (!ev.id || !ev.name || !ev.datetime_start) continue;
        out.push({
          source: "eventfinda",
          external_id: String(ev.id),
          title: ev.name,
          description: clip(ev.description),
          starts_at: new Date(ev.datetime_start).toISOString(),
          ends_at: ev.datetime_end ? new Date(ev.datetime_end).toISOString() : null,
          city: guessCity(ev.location_summary, ev.address),
          venue: ev.location_summary ?? null,
          address: ev.address ?? null,
          url: ev.url ?? null,
          price: ev.is_free ? "Free" : null,
        });
      }
      await new Promise((r) => setTimeout(r, 1100)); // ToS: max 1 req/sec
    }
  }
  return out;
}

// ---------- Christchurch Pride (The Events Calendar REST) ----------
async function fetchChchPride(): Promise<ImportedEvent[]> {
  const today = new Date().toISOString().slice(0, 10);
  const res = await fetch(
    `https://www.chchpride.co.nz/wp-json/tribe/events/v1/events?per_page=50&start_date=${today}`,
    { headers: { "User-Agent": "RainbowNavigator/1.0 (community events importer)" } },
  );
  if (!res.ok) throw new Error(`chchpride ${res.status}`);
  const data = await res.json();
  return (data.events ?? []).map((ev: any) => ({
    source: "chchpride",
    external_id: String(ev.id),
    title: clip(ev.title, 200) ?? "Untitled",
    description: clip(ev.description),
    starts_at: new Date(ev.utc_start_date ? ev.utc_start_date + "Z" : ev.start_date).toISOString(),
    ends_at: ev.utc_end_date ? new Date(ev.utc_end_date + "Z").toISOString() : null,
    city: "Christchurch",
    venue: ev.venue?.venue ?? null,
    address: ev.venue?.address ?? null,
    url: ev.url ?? null,
    price: ev.cost || null,
  })).filter((ev: ImportedEvent) => ev.title !== "Untitled" || ev.url);
}

// ---------- Humanitix host pages (JSON-LD / __NEXT_DATA__) ----------
function walkForEvents(node: unknown, found: any[], depth = 0) {
  if (depth > 12 || !node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const item of node) walkForEvents(item, found, depth + 1);
    return;
  }
  const obj = node as Record<string, unknown>;
  const name = obj.name ?? obj.title;
  const start = obj.startDate ?? obj.startDateTime ?? (obj.dates && (obj.dates as any).startDate);
  if (typeof name === "string" && typeof start === "string" && !Number.isNaN(Date.parse(start))) {
    found.push(obj);
  }
  for (const v of Object.values(obj)) walkForEvents(v, found, depth + 1);
}

async function fetchHumanitix(): Promise<ImportedEvent[]> {
  const out: ImportedEvent[] = [];
  for (const host of HUMANITIX_HOSTS) {
    const res = await fetch(`https://events.humanitix.com/host/${host}`, {
      headers: { "User-Agent": "RainbowNavigator/1.0 (community events importer)" },
    });
    if (!res.ok) throw new Error(`humanitix host ${host} ${res.status}`);
    const html = await res.text();
    const candidates: any[] = [];
    // JSON-LD blocks first, then the Next.js data payload
    for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      try { walkForEvents(JSON.parse(m[1]), candidates); } catch { /* malformed block */ }
    }
    const next = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (next) {
      try { walkForEvents(JSON.parse(next[1]), candidates); } catch { /* ignore */ }
    }
    const seen = new Set<string>();
    for (const ev of candidates) {
      const title = String(ev.name ?? ev.title);
      const start = String(ev.startDate ?? ev.startDateTime ?? ev.dates?.startDate);
      if (Number.isNaN(Date.parse(start)) || Date.parse(start) < Date.now() - 86400_000) continue;
      const slug = typeof ev.slug === "string" ? ev.slug : null;
      const url = typeof ev.url === "string" && ev.url.startsWith("http")
        ? ev.url
        : slug ? `https://events.humanitix.com/${slug}` : `https://events.humanitix.com/host/${host}`;
      const key = `${normTitle(title)}|${start.slice(0, 10)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const loc = ev.location ?? ev.eventLocation ?? {};
      const venue = typeof loc === "string" ? loc : (loc.venueName ?? loc.name ?? null);
      const address = typeof loc === "object" ? (loc.address ?? loc.streetAddress ?? null) : null;
      out.push({
        source: "humanitix",
        external_id: slug ?? key,
        title,
        description: clip(ev.description),
        starts_at: new Date(start).toISOString(),
        ends_at: ev.endDate && !Number.isNaN(Date.parse(String(ev.endDate)))
          ? new Date(String(ev.endDate)).toISOString() : null,
        city: guessCity(typeof venue === "string" ? venue : null, typeof address === "string" ? address : null, title) ?? (host === "theta-project" ? "Auckland" : null),
        venue: typeof venue === "string" ? venue : null,
        address: typeof address === "string" ? address : null,
        url,
        price: null,
      });
    }
  }
  return out;
}

// ---------- main ----------
Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const sources: Record<string, () => Promise<ImportedEvent[]>> = {
    eventfinda: () => fetchEventfinda(supabase),
    chchpride: fetchChchPride,
    humanitix: fetchHumanitix,
  };

  // Optional: run a single source via ?source=name (handy for testing)
  const only = new URL(req.url).searchParams.get("source");

  const report: Record<string, SourceReport> = {};

  // Existing keys for dedupe: per-source ids and cross-source title+day
  const { data: existing } = await supabase
    .from("events")
    .select("source, external_id, title, starts_at")
    .gte("starts_at", new Date(Date.now() - 7 * 86400_000).toISOString());
  const byId = new Set((existing ?? []).filter((e) => e.external_id).map((e) => `${e.source}|${e.external_id}`));
  const byTitleDay = new Set((existing ?? []).map((e) => `${normTitle(e.title)}|${e.starts_at?.slice(0, 10)}`));

  for (const [name, fetcher] of Object.entries(sources)) {
    if (only && only !== name) continue;
    report[name] = { fetched: 0, inserted: 0, skipped: 0 };
    try {
      const events = await fetcher();
      report[name].fetched = events.length;
      for (const ev of events) {
        const idKey = `${ev.source}|${ev.external_id}`;
        const dayKey = `${normTitle(ev.title)}|${ev.starts_at.slice(0, 10)}`;
        if (byId.has(idKey) || byTitleDay.has(dayKey)) {
          report[name].skipped++;
          continue;
        }
        const { error } = await supabase.from("events").insert({ ...ev, status: "pending" });
        if (error) {
          // Unique-index race or similar: count as skipped, keep going
          report[name].skipped++;
          console.error(`insert failed for ${idKey}:`, error.message);
        } else {
          byId.add(idKey);
          byTitleDay.add(dayKey);
          report[name].inserted++;
        }
      }
    } catch (err) {
      report[name].error = String(err instanceof Error ? err.message : err);
      console.error(`source ${name} failed:`, err);
    }
  }

  return new Response(JSON.stringify({ ok: true, report }, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
});
