import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, ExternalLink, MapPin, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/components/ui/use-toast";

const CITIES = [
  "All cities", "Wellington", "Auckland", "Christchurch", "Hamilton", "Tauranga",
  "Dunedin", "Napier", "Nelson", "Palmerston North", "Whanganui", "Whangarei", "Other",
];

// Real community events: publicly browsable, community-submitted with a
// pending-review queue — the "what's on, and when" layer.
export default function EventsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState("All cities");
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "", date: "", time: "", city: "", venue: "", url: "", description: "", price: "",
  });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "approved")
        .gte("starts_at", new Date(Date.now() - 6 * 3600_000).toISOString())
        .order("starts_at");
      if (error) throw error;
      return data || [];
    },
  });

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return events.filter((ev: any) => {
      if (city !== "All cities" && ev.city !== city) return false;
      if (q) {
        const hay = [ev.title, ev.description, ev.city, ev.venue].filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [events, searchQuery, city]);

  const set = (field: string) => (value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleAddClick = () => {
    if (!user) { navigate("/auth"); return; }
    setShowAdd(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) {
      toast({ title: "Please add at least a title and date", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const startsAt = new Date(`${form.date}T${form.time || "19:00"}`);
      const { error } = await supabase.from("events").insert({
        submitted_by: user!.id,
        title: form.title.trim(),
        description: form.description.trim() || null,
        starts_at: startsAt.toISOString(),
        city: form.city || null,
        venue: form.venue.trim() || null,
        url: form.url.trim() || null,
        price: form.price.trim() || null,
        status: "pending",
      });
      if (error) throw error;
      setShowAdd(false);
      setForm({ title: "", date: "", time: "", city: "", venue: "", url: "", description: "", price: "" });
      toast({
        title: "Event submitted 🌈",
        description: "It's pending review and will appear once approved.",
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    } catch (err) {
      console.error("Event submission failed:", err);
      toast({ title: "Couldn't submit the event", description: "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Group events by day for a scannable calendar feel
  const byDay = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const ev of filtered) {
      const key = new Date(ev.starts_at).toLocaleDateString("en-NZ", {
        weekday: "long", day: "numeric", month: "long",
      });
      map.set(key, [...(map.get(key) || []), ev]);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <div className="pb-6 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button
          size="sm"
          className="rounded-full bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
          onClick={handleAddClick}
        >
          <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
          Add event
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-9 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search events"
          />
        </div>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-[150px] rounded-full" aria-label="City">
            <MapPin className="h-4 w-4 mr-1 text-primary" aria-hidden="true" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
        </div>
      ) : byDay.length === 0 ? (
        <div className="text-center py-14 space-y-3">
          <Calendar className="h-8 w-8 text-muted-foreground mx-auto" aria-hidden="true" />
          <h2 className="font-medium">No upcoming events listed yet</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Community events appear here once approved. Know of a quiz night,
            hike, social or show? Be the first to add it.
          </p>
          <Button size="sm" className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover" onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-1" aria-hidden="true" /> Add event
          </Button>
        </div>
      ) : (
        byDay.map(([day, dayEvents]) => (
          <div key={day} className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{day}</h2>
            {dayEvents.map((ev: any) => (
              <Card key={ev.id} className="card-hover">
                <CardContent className="p-4 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight">{ev.title}</h3>
                    {ev.price && <Badge variant="secondary" className="shrink-0">{ev.price}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ev.starts_at).toLocaleTimeString("en-NZ", { hour: "numeric", minute: "2-digit" })}
                    {ev.venue ? ` · ${ev.venue}` : ""}
                    {ev.city ? ` · ${ev.city}` : ""}
                  </p>
                  {ev.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{ev.description}</p>
                  )}
                  {ev.url && (
                    <a
                      href={ev.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary underline inline-flex items-center gap-1"
                    >
                      Event page <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ))
      )}

      {/* Add event dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Add a community event</DialogTitle>
            <DialogDescription>
              Reviewed before it appears — keeps the calendar genuine.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="e-title">Event name *</Label>
              <Input id="e-title" value={form.title} onChange={(e) => set("title")(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="e-date">Date *</Label>
                <Input id="e-date" type="date" value={form.date} onChange={(e) => set("date")(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="e-time">Start time</Label>
                <Input id="e-time" type="time" value={form.time} onChange={(e) => set("time")(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>City</Label>
                <Select value={form.city} onValueChange={set("city")}>
                  <SelectTrigger aria-label="Event city"><SelectValue placeholder="Choose..." /></SelectTrigger>
                  <SelectContent>
                    {CITIES.filter((c) => c !== "All cities").map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="e-price">Price</Label>
                <Input id="e-price" placeholder="Free / $10" value={form.price} onChange={(e) => set("price")(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e-venue">Venue</Label>
              <Input id="e-venue" placeholder="e.g. Ivy Bar, 63 Cuba Street" value={form.venue} onChange={(e) => set("venue")(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e-url">Link (tickets / event page)</Label>
              <Input id="e-url" placeholder="https://..." value={form.url} onChange={(e) => set("url")(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e-desc">Description</Label>
              <Textarea id="e-desc" rows={2} value={form.description} onChange={(e) => set("description")(e.target.value)} />
            </div>
            <Button type="submit" className="w-full bg-rainbow-gradient hover:bg-rainbow-gradient-hover" disabled={submitting}>
              {submitting ? "Sending..." : "Submit for review"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
