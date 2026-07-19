import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LocateFixed, MapPin, Plus, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CITY_COORDINATES } from "@/components/map/mapUtils";
import { useUser } from "@/contexts/UserContext";

const ALL_LOCATIONS = "All locations";

// Nearest known city to a lat/lng, among the cities that actually have groups
function nearestCity(lat: number, lng: number, candidates: string[]): string | null {
  let best: string | null = null;
  let bestDist = Infinity;
  for (const city of candidates) {
    const coords = CITY_COORDINATES[city];
    if (!coords) continue;
    const d = (coords.lat - lat) ** 2 + (coords.lng - lng) ** 2;
    if (d < bestDist) { bestDist = d; best = city; }
  }
  return best;
}

const AUDIENCE_FILTERS = [
  "All", "Everyone", "Rainbow youth", "Lesbians & queer women",
  "Gay & bi men", "Trans & non-binary", "Takatāpui", "Whānau & allies",
];

// Real community groups from the database — the "who gathers, doing what,
// and for whom" layer behind the map.
export default function ConnectPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [audience, setAudience] = useState("All");
  const [cityFilter, setCityFilter] = useState(ALL_LOCATIONS);
  const [isLocating, setIsLocating] = useState(false);
  const [autoLocated, setAutoLocated] = useState(false);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("status", "approved")
        .order("city")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: myGroupIds = [] } = useQuery({
    queryKey: ["my-groups", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("group_members").select("group_id");
      if (error) throw error;
      return (data || []).map((r: any) => r.group_id as string);
    },
  });

  // Every city that has at least one group, for the dropdown
  const allCities = useMemo(
    () => [...new Set(groups.map((g: any) => g.city || "Elsewhere"))].sort() as string[],
    [groups]
  );

  const locate = (silent = false) => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const near = nearestCity(pos.coords.latitude, pos.coords.longitude, allCities);
        if (near) {
          setCityFilter(near);
          if (!silent) toast({ title: `Showing groups near ${near}` });
        }
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        if (!silent) {
          toast({ title: "Couldn't get your location", description: "Choose a city from the dropdown instead.", variant: "destructive" });
        }
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  };

  // If location permission was already granted, default to the user's
  // nearest city without prompting; otherwise wait for the button.
  useEffect(() => {
    if (autoLocated || allCities.length === 0) return;
    setAutoLocated(true);
    (navigator as any).permissions?.query({ name: "geolocation" })
      .then((status: PermissionStatus) => {
        if (status.state === "granted") locate(true);
      })
      .catch(() => { /* permissions API unavailable — stay on All locations */ });
  }, [allCities, autoLocated]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return groups.filter((g: any) => {
      if (cityFilter !== ALL_LOCATIONS && (g.city || "Elsewhere") !== cityFilter) return false;
      if (audience !== "All" && !(g.audience || []).includes(audience)) return false;
      if (q) {
        const hay = [g.name, g.description, g.city, ...(g.activities || []), ...(g.audience || [])]
          .filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [groups, searchQuery, audience, cityFilter]);

  const cities = useMemo(
    () => [...new Set(filtered.map((g: any) => g.city || "Elsewhere"))],
    [filtered]
  );

  const handleJoinToggle = async (e: React.MouseEvent, groupId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate("/auth"); return; }
    const joined = myGroupIds.includes(groupId);
    const result = joined
      ? await supabase.from("group_members").delete().eq("group_id", groupId).eq("user_id", user.id)
      : await supabase.from("group_members").insert({ group_id: groupId, user_id: user.id });
    if (!result.error) {
      queryClient.invalidateQueries({ queryKey: ["my-groups"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["group"] });
    }
  };

  return (
    <div className="pb-6 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Connect</h1>
        <Button
          size="sm"
          className="rounded-full bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
          onClick={() => navigate("/connect/new")}
        >
          <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
          Add your group
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          placeholder="Search groups, activities, cities..."
          className="pl-9 rounded-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search groups"
        />
      </div>

      {/* Location: nearest city via the locate button, or pick from the list */}
      <div className="flex items-center gap-2">
        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger className="flex-1 rounded-full" aria-label="Choose a location">
            <MapPin className="h-4 w-4 mr-1 text-primary shrink-0" aria-hidden="true" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_LOCATIONS}>{ALL_LOCATIONS}</SelectItem>
            {allCities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full shrink-0"
          onClick={() => locate(false)}
          disabled={isLocating}
          aria-label="Show groups near me"
        >
          <LocateFixed className={`h-4 w-4 mr-1 ${isLocating ? "animate-spin" : ""}`} aria-hidden="true" />
          Near me
        </Button>
      </div>

      {/* Who is it for? — made explicit, because it matters */}
      <ScrollArea className="w-full whitespace-nowrap" orientation="horizontal">
        <div className="flex items-center gap-2 px-1 py-1">
          {AUDIENCE_FILTERS.map((a) => (
            <Badge
              key={a}
              variant={audience === a ? "default" : "outline"}
              className={`rounded-full cursor-pointer px-3 py-1.5 ${
                audience === a ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted/50"
              }`}
              onClick={() => setAudience(a)}
            >
              {a}
            </Badge>
          ))}
        </div>
      </ScrollArea>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14 space-y-3">
          <Users className="h-8 w-8 text-muted-foreground mx-auto" aria-hidden="true" />
          <p className="text-muted-foreground">No groups match yet.</p>
          <Button asChild variant="outline" size="sm">
            <Link to="/connect/new">Know one? Add it</Link>
          </Button>
        </div>
      ) : (
        cities.map((city) => (
          <div key={city} className="space-y-3">
            <h2 className="text-lg font-semibold">{city}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered
                .filter((g: any) => (g.city || "Elsewhere") === city)
                .map((group: any) => {
                  const joined = myGroupIds.includes(group.id);
                  return (
                    <Link key={group.id} to={`/connect/groups/${group.id}`} className="block group">
                      <Card className="h-full card-hover">
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors">
                              {group.name}
                            </h3>
                            <Button
                              size="sm"
                              variant={joined ? "default" : "outline"}
                              className={`shrink-0 rounded-full ${joined ? "bg-rainbow-gradient hover:bg-rainbow-gradient-hover" : ""}`}
                              onClick={(e) => handleJoinToggle(e, group.id)}
                            >
                              {joined ? "Joined ✓" : "Join"}
                            </Button>
                          </div>
                          {group.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {(group.audience || []).map((a: string) => (
                              <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
                            ))}
                            {(group.activities || []).slice(0, 3).map((act: string) => (
                              <Badge key={act} variant="outline" className="text-xs">{act}</Badge>
                            ))}
                          </div>
                          {group.member_count > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {group.member_count} member{group.member_count === 1 ? "" : "s"} here
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
