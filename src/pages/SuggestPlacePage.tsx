import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/components/ui/use-toast";

const CATEGORIES = ["Cafes", "Bars", "Nightlife", "Shopping", "Services", "Healthcare", "Community"];
const CITIES = [
  "Wellington", "Auckland", "Christchurch", "Hamilton", "Tauranga", "Dunedin",
  "Napier", "Nelson", "Palmerston North", "Whanganui", "Whangarei", "Porirua",
  "Lower Hutt", "Upper Hutt", "Invercargill", "Timaru", "Other",
];

// Community submission form: suggestions land in a Pending Review queue and
// only appear on the map after moderation.
export default function SuggestPlacePage() {
  const { user } = useUser();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    city: "",
    address: "",
    website: "",
    description: "",
    why: "",
  });

  const set = (field: string) => (value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category) {
      toast({ title: "Please add at least a name and category", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("place_suggestions").insert({
        submitted_by: user!.id,
        name: form.name.trim(),
        category: form.category,
        city: form.city || null,
        address: form.address.trim() || null,
        website: form.website.trim() || null,
        description: form.description.trim() || null,
        why_suggest: form.why.trim() || null,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error("Suggestion failed:", err);
      toast({ title: "Couldn't send your suggestion", description: "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex justify-center py-10">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto" aria-hidden="true" />
            <h1 className="text-2xl font-bold">Thank you! 🌈</h1>
            <p className="text-muted-foreground">
              Your suggestion is now <strong>pending review</strong>. We check every
              submission before it appears on the map, to keep the community safe
              and the information trustworthy.
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ name: "", category: "", city: "", address: "", website: "", description: "", why: "" }); }}>
                Suggest another
              </Button>
              <Button asChild className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover">
                <Link to="/">Back to the map</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-6">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
            Suggest a place
          </CardTitle>
          <CardDescription>
            Know a café, club, group or service where the rainbow community is
            genuinely welcome? Add it here — every suggestion is reviewed before
            it appears on the map.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="s-name">Place name *</Label>
              <Input id="s-name" value={form.name} onChange={(e) => set("name")(e.target.value)} placeholder="e.g. Sunshine Café" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={set("category")}>
                  <SelectTrigger aria-label="Category">
                    <SelectValue placeholder="Choose..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>City / town</Label>
                <Select value={form.city} onValueChange={set("city")}>
                  <SelectTrigger aria-label="City or town">
                    <SelectValue placeholder="Choose..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-address">Street address</Label>
              <Input id="s-address" value={form.address} onChange={(e) => set("address")(e.target.value)} placeholder="e.g. 123 Cuba Street" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-website">Website or social page</Label>
              <Input id="s-website" value={form.website} onChange={(e) => set("website")(e.target.value)} placeholder="https://..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-description">What is this place?</Label>
              <Textarea id="s-description" value={form.description} onChange={(e) => set("description")(e.target.value)} rows={2} placeholder="A short description" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-why">Why is it good for the community?</Label>
              <Textarea id="s-why" value={form.why} onChange={(e) => set("why")(e.target.value)} rows={2} placeholder="e.g. Queer-owned, hosts a weekly rainbow social night..." />
            </div>

            <Button type="submit" className="w-full bg-rainbow-gradient hover:bg-rainbow-gradient-hover" disabled={submitting}>
              {submitting ? "Sending..." : "Submit for review"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
