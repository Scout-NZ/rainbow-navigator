import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, X, ExternalLink, ShieldCheck, CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";

// Moderation queue: everything the community and the importers submit lands
// as "pending" and only appears in the app once approved here.
export default function AdminPage() {
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const queryClient = useQueryClient();
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data: pendingEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["admin-pending-events"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "pending")
        .order("starts_at");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: pendingPlaces = [], isLoading: placesLoading } = useQuery({
    queryKey: ["admin-pending-places"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("place_suggestions")
        .select("*")
        .eq("status", "pending")
        .order("created_at");
      if (error) throw error;
      return data || [];
    },
  });

  if (adminLoading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  const setEventStatus = async (id: string, status: "approved" | "rejected") => {
    setBusyId(id);
    try {
      const { error } = await supabase.from("events").update({ status }).eq("id", id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["admin-pending-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    } catch (err) {
      console.error("Event moderation failed:", err);
      toast({ title: "Couldn't update the event", variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  const moderateSuggestion = async (suggestion: any, approve: boolean) => {
    setBusyId(suggestion.id);
    try {
      if (approve) {
        const { error: insertError } = await supabase.from("locations").insert({
          name: suggestion.name,
          category: suggestion.category,
          city: suggestion.city,
          address: suggestion.address,
          description: suggestion.description,
          website: suggestion.website,
          verified: false,
        });
        if (insertError) throw insertError;
      }
      const { error } = await supabase
        .from("place_suggestions")
        .update({ status: approve ? "approved" : "rejected" })
        .eq("id", suggestion.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["admin-pending-places"] });
      if (approve) {
        toast({ title: "Place added 🌈", description: `${suggestion.name} is now in the directory.` });
      }
    } catch (err) {
      console.error("Suggestion moderation failed:", err);
      toast({ title: "Couldn't process the suggestion", variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  const fmtWhen = (iso: string) =>
    new Date(iso).toLocaleString("en-NZ", {
      weekday: "short", day: "numeric", month: "short",
      hour: "numeric", minute: "2-digit",
    });

  return (
    <div className="pb-6 space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
        <h1 className="text-2xl font-bold">Review queue</h1>
      </div>

      <Tabs defaultValue="events">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">
            <CalendarDays className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Events {pendingEvents.length > 0 && `(${pendingEvents.length})`}
          </TabsTrigger>
          <TabsTrigger value="places">
            <MapPin className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Places {pendingPlaces.length > 0 && `(${pendingPlaces.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-3 mt-4">
          {eventsLoading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
          ) : pendingEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Queue's empty — nothing waiting for review. 🌈
            </p>
          ) : (
            pendingEvents.map((ev: any) => (
              <Card key={ev.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight">{ev.title}</h3>
                    {ev.source && (
                      <Badge variant="outline" className="shrink-0 text-xs">{ev.source}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {fmtWhen(ev.starts_at)}
                    {ev.venue ? ` · ${ev.venue}` : ""}
                    {ev.city ? ` · ${ev.city}` : ""}
                  </p>
                  {ev.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{ev.description}</p>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={busyId === ev.id}
                      onClick={() => setEventStatus(ev.id, "approved")}
                    >
                      <Check className="h-4 w-4 mr-1" aria-hidden="true" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive"
                      disabled={busyId === ev.id}
                      onClick={() => setEventStatus(ev.id, "rejected")}
                    >
                      <X className="h-4 w-4 mr-1" aria-hidden="true" /> Reject
                    </Button>
                    {ev.url && (
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary underline inline-flex items-center gap-1 ml-auto"
                      >
                        Source <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="places" className="space-y-3 mt-4">
          {placesLoading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
          ) : pendingPlaces.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No place suggestions waiting. 🌈
            </p>
          ) : (
            pendingPlaces.map((s: any) => (
              <Card key={s.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight">{s.name}</h3>
                    <Badge variant="outline" className="shrink-0 text-xs">{s.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {[s.address, s.city].filter(Boolean).join(", ")}
                  </p>
                  {s.description && <p className="text-sm text-muted-foreground">{s.description}</p>}
                  {s.why_suggest && (
                    <p className="text-sm italic text-muted-foreground">"{s.why_suggest}"</p>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={busyId === s.id}
                      onClick={() => moderateSuggestion(s, true)}
                    >
                      <Check className="h-4 w-4 mr-1" aria-hidden="true" /> Add to directory
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive"
                      disabled={busyId === s.id}
                      onClick={() => moderateSuggestion(s, false)}
                    >
                      <X className="h-4 w-4 mr-1" aria-hidden="true" /> Reject
                    </Button>
                    {s.website && (
                      <a
                        href={s.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary underline inline-flex items-center gap-1 ml-auto"
                      >
                        Website <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
