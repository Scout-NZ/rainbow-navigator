import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Flame, MapPin, MessageCircle, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

// Community feed v1: the pulse of what's happening — upcoming events,
// places buzzing on the heat map, fresh arrivals in the directory, and
// recent anonymous rating comments. Designed to grow into a full feed
// (check-ins with photos and posts) later.
export default function CommunityPage() {
  const { data: events = [] } = useQuery({
    queryKey: ["community-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, city, venue, starts_at, image_url, url")
        .eq("status", "approved")
        .gte("starts_at", new Date().toISOString())
        .lte("starts_at", new Date(Date.now() + 14 * 86400_000).toISOString())
        .order("starts_at")
        .limit(6);
      if (error) throw error;
      return data || [];
    },
  });

  const { data: buzzing = [] } = useQuery({
    queryKey: ["community-buzzing"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("place_activity")
        .select("location_id, activity_score, checkins")
        .gt("activity_score", 0)
        .order("activity_score", { ascending: false })
        .limit(5);
      if (error) throw error;
      const ids = (data || []).map((r: any) => r.location_id);
      if (!ids.length) return [];
      const { data: places } = await supabase
        .from("locations").select("id, name, city, category, image_url").in("id", ids);
      const byId = Object.fromEntries((places || []).map((p: any) => [p.id, p]));
      return (data || []).map((r: any) => ({ ...r, place: byId[r.location_id] })).filter((r: any) => r.place);
    },
  });

  const { data: newPlaces = [] } = useQuery({
    queryKey: ["community-new-places"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("id, name, city, category, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
  });

  const { data: newGroups = [] } = useQuery({
    queryKey: ["community-new-groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("id, name, city, created_at")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["community-comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("place_rating_comments")
        .select("location_id, comment, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      const ids = [...new Set((data || []).map((r: any) => r.location_id))];
      if (!ids.length) return [];
      const { data: places } = await supabase
        .from("locations").select("id, name").in("id", ids);
      const byId = Object.fromEntries((places || []).map((p: any) => [p.id, p.name]));
      return (data || []).map((r: any) => ({ ...r, placeName: byId[r.location_id] }));
    },
  });

  const fmtWhen = useMemo(
    () => (iso: string) =>
      new Date(iso).toLocaleString("en-NZ", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }),
    [],
  );

  return (
    <div className="pb-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" /> Community
        </h1>
        <p className="text-sm text-muted-foreground">
          The pulse of rainbow Aotearoa — what's on, what's buzzing, and who's new.
        </p>
      </div>

      {/* Happening soon */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" aria-hidden="true" /> Happening soon
          </h2>
          <Button asChild variant="ghost" size="sm"><Link to="/events">All events</Link></Button>
        </div>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing in the next fortnight yet — check the Events page.</p>
        ) : (
          <div className="space-y-2">
            {events.map((ev: any) => (
              <Card key={ev.id} className="overflow-hidden card-hover">
                <div className="flex">
                  {ev.image_url && (
                    <div className="w-24 shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${ev.image_url})` }} aria-hidden="true" />
                  )}
                  <CardContent className="p-3 space-y-0.5 min-w-0">
                    <h3 className="font-medium leading-tight truncate">{ev.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {fmtWhen(ev.starts_at)}{ev.city ? ` · ${ev.city}` : ""}
                    </p>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Buzzing places */}
      {buzzing.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-primary" aria-hidden="true" /> Buzzing right now
          </h2>
          <div className="space-y-2">
            {buzzing.map((b: any) => (
              <Link key={b.location_id} to={`/place/${b.location_id}`} className="block">
                <Card className="card-hover">
                  <CardContent className="p-3 flex items-center gap-3">
                    {b.place.image_url && (
                      <div className="h-10 w-10 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${b.place.image_url})` }} aria-hidden="true" />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium leading-tight truncate">{b.place.name}</h3>
                      <p className="text-xs text-muted-foreground">{b.place.category} · {b.place.city}</p>
                    </div>
                    {b.checkins > 0 && (
                      <Badge variant="secondary" className="shrink-0">{b.checkins} check-ins</Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* What the community is saying */}
      {comments.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" /> What the community is saying
          </h2>
          <div className="space-y-2">
            {comments.map((c: any, i: number) => (
              <Link key={i} to={`/place/${c.location_id}`} className="block">
                <Card className="card-hover">
                  <CardContent className="p-3 space-y-1">
                    <p className="text-sm italic">"{c.comment}"</p>
                    <p className="text-xs text-muted-foreground">on {c.placeName}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* New arrivals */}
      <section className="space-y-3">
        <h2 className="font-semibold flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-primary" aria-hidden="true" /> New on the map
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {newPlaces.map((p: any) => (
            <Link key={p.id} to={`/place/${p.id}`}>
              <Badge variant="outline" className="rounded-full px-3 py-1.5 hover:bg-muted/50">
                {p.name} · {p.city}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold flex items-center gap-1.5">
          <Users className="h-4 w-4 text-primary" aria-hidden="true" /> New groups
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {newGroups.map((g: any) => (
            <Link key={g.id} to={`/connect/groups/${g.id}`}>
              <Badge variant="outline" className="rounded-full px-3 py-1.5 hover:bg-muted/50">
                {g.name} · {g.city}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      <Card className="border-dashed">
        <CardContent className="p-4 text-sm text-muted-foreground text-center">
          Posts and photos are coming — for now, check in at the places you love
          and they'll light up here and on the heat map. 🌈
        </CardContent>
      </Card>
    </div>
  );
}
