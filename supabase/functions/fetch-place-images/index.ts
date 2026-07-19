// Backfills locations.image_url from each place's own website by reading its
// social-share image (og:image / twitter:image). Processes rows where
// image_url is still null, in batches — call repeatedly (?limit=40) until
// "remaining" stops shrinking; sites without a share image stay null and
// fall back to the category artwork in the app. Sites that fail or have no
// share image get an empty-string sentinel (falsy in the app, so the
// category fallback still applies) so later runs don't re-check them.

import { createClient } from "npm:@supabase/supabase-js@2";

const UA =
  "Mozilla/5.0 (compatible; RainbowNavigator/1.0; +https://rainbow-navigator.vercel.app)";

function extractImage(html: string, baseUrl: string): string | null {
  const patterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) {
      try {
        const url = new URL(m[1].replace(/&amp;/g, "&"), baseUrl).toString();
        if (url.startsWith("http")) return url;
      } catch { /* malformed URL in meta tag */ }
    }
  }
  return null;
}

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const params = new URL(req.url).searchParams;
  const limit = Math.min(Number(params.get("limit") || 40), 60);
  // ?table=groups pulls logos for community groups (website or contact_link)
  const table = params.get("table") === "groups" ? "groups" : "locations";
  const fields = table === "groups" ? "id, name, website, contact_link" : "id, name, website";

  let query = supabase.from(table).select(fields).is("image_url", null).order("name").limit(limit);
  if (table === "locations") query = query.not("website", "is", null).neq("website", "");
  const { data: places, error } = await query;
  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
  }

  let updated = 0;
  const failures: string[] = [];

  for (const place of places ?? []) {
    const target = place.website || (place as any).contact_link;
    if (!target) continue;
    const site = target.startsWith("http") ? target : `https://${target}`;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(site, {
        headers: { "User-Agent": UA, Accept: "text/html" },
        signal: controller.signal,
        redirect: "follow",
      });
      clearTimeout(timer);
      if (!res.ok) {
        failures.push(`${place.name}: ${res.status}`);
        await supabase.from(table).update({ image_url: "" }).eq("id", place.id);
        continue;
      }
      const html = (await res.text()).slice(0, 300_000);
      const image = extractImage(html, res.url || site);
      if (image) {
        const { error: upErr } = await supabase
          .from(table).update({ image_url: image }).eq("id", place.id);
        if (!upErr) updated++;
      } else {
        failures.push(`${place.name}: no og:image`);
        await supabase.from(table).update({ image_url: "" }).eq("id", place.id);
      }
    } catch (err) {
      failures.push(`${place.name}: ${err instanceof Error ? err.name : "error"}`);
      await supabase.from(table).update({ image_url: "" }).eq("id", place.id);
    }
  }

  const { count } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .is("image_url", null);

  return new Response(
    JSON.stringify({ ok: true, checked: places?.length ?? 0, updated, remaining: count, failures }, null, 2),
    { headers: { "Content-Type": "application/json" } },
  );
});
