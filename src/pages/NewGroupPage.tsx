import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/components/ui/use-toast";

const AUDIENCES = [
  "Everyone", "Rainbow youth", "Lesbians & queer women", "Gay & bi men",
  "Trans & non-binary", "Takatāpui", "Whānau & allies",
];
const CITIES = [
  "Wellington", "Auckland", "Christchurch", "Hamilton", "Tauranga", "Dunedin",
  "Napier", "Nelson", "Palmerston North", "Whanganui", "Whangarei", "Porirua",
  "Lower Hutt", "Upper Hutt", "Invercargill", "Timaru", "Nationwide", "Other",
];

// Add-your-group form: gets real community groups (like the WhatsApp hiking
// crews) discoverable. Submissions are reviewed before appearing.
export default function NewGroupPage() {
  const { user } = useUser();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [audience, setAudience] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "", description: "", city: "", activities: "",
    meeting_info: "", website: "", contact_link: "",
  });

  const set = (field: string) => (value: string) => setForm((f) => ({ ...f, [field]: value }));
  const toggleAudience = (a: string) =>
    setAudience((cur) => (cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: "Please add the group's name", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("groups").insert({
        created_by: user!.id,
        name: form.name.trim(),
        description: form.description.trim() || null,
        city: form.city || null,
        audience: audience.length ? audience : ["Everyone"],
        activities: form.activities
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        meeting_info: form.meeting_info.trim() || null,
        website: form.website.trim() || null,
        contact_link: form.contact_link.trim() || null,
        status: "pending",
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error("Group submission failed:", err);
      toast({ title: "Couldn't submit the group", description: "Please try again.", variant: "destructive" });
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
              Your group is <strong>pending review</strong> — we check every
              submission so the directory stays safe and genuine.
            </p>
            <Button asChild className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover">
              <Link to="/connect">Back to Connect</Link>
            </Button>
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
            <Users className="h-5 w-5 text-primary" aria-hidden="true" />
            Add your group
          </CardTitle>
          <CardDescription>
            Run a rainbow social group, sports team, or meetup — even one that
            lives on WhatsApp or Facebook? List it here so people who've just
            arrived in your city can find you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="g-name">Group name *</Label>
              <Input id="g-name" value={form.name} onChange={(e) => set("name")(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label>Who is it for?</Label>
              <div className="flex flex-wrap gap-1.5">
                {AUDIENCES.map((a) => (
                  <Badge
                    key={a}
                    variant={audience.includes(a) ? "default" : "outline"}
                    className={`rounded-full cursor-pointer px-3 py-1.5 ${
                      audience.includes(a) ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"
                    }`}
                    onClick={() => toggleAudience(a)}
                  >
                    {a}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>City / region</Label>
              <Select value={form.city} onValueChange={set("city")}>
                <SelectTrigger aria-label="City"><SelectValue placeholder="Choose..." /></SelectTrigger>
                <SelectContent>
                  {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="g-desc">What's the group about?</Label>
              <Textarea id="g-desc" value={form.description} onChange={(e) => set("description")(e.target.value)} rows={2} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="g-activities">Activities (comma separated)</Label>
              <Input id="g-activities" placeholder="e.g. Hiking, Quiz nights, Dinners" value={form.activities} onChange={(e) => set("activities")(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="g-meeting">When & where do you usually meet?</Label>
              <Input id="g-meeting" placeholder="e.g. Saturday walks + monthly quiz night" value={form.meeting_info} onChange={(e) => set("meeting_info")(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="g-link">Where do people find you? (WhatsApp / Facebook / Meetup link)</Label>
              <Input id="g-link" placeholder="https://..." value={form.contact_link} onChange={(e) => set("contact_link")(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="g-website">Website (if you have one)</Label>
              <Input id="g-website" placeholder="https://..." value={form.website} onChange={(e) => set("website")(e.target.value)} />
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
