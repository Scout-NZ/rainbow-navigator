import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

// The six-colour community rating (docs/rainbow-rating-research.md).
// Businesses can never light their own rainbow: every segment fills only
// from community post-visit ratings, and a complete rainbow needs ALL six
// strong — one dimension can't compensate for another.
export const RATING_DIMENSIONS = [
  { key: "safety", label: "Safety", color: "#E40303", question: "Did you feel safe here — free from hostility or harassment?" },
  { key: "staff", label: "Staff", color: "#FF8C00", question: "Did staff get it right — your name, pronouns, respectful service?" },
  { key: "visibility", label: "Visibility", color: "#EAC800", question: "Could you tell you'd be welcome before walking in — beyond Pride month?" },
  { key: "facilities", label: "Facilities", color: "#008026", question: "Did the practical stuff fit — toilets, changing rooms, forms?" },
  { key: "belonging", label: "Belonging", color: "#0057E7", question: "Could you fully be yourself here?" },
  { key: "community", label: "Community", color: "#750787", question: "Do they genuinely show up for the whole community, beyond the flag?" },
] as const;

type DimensionKey = (typeof RATING_DIMENSIONS)[number]["key"];
type Scores = Partial<Record<DimensionKey, number | null>>;

// Concentric semicircle arcs, red outermost to purple innermost — an actual
// rainbow whose bands only appear as the community rates them.
export function RainbowArc({ summary, size = 190 }: { summary: any | null; size?: number }) {
  const radii = [100, 87, 74, 61, 48, 35];
  return (
    <svg
      viewBox="0 0 220 116"
      width={size}
      height={(size / 220) * 116}
      role="img"
      aria-label="Rainbow rating"
    >
      {RATING_DIMENSIONS.map((dim, i) => {
        const r = radii[i];
        const score = summary?.[dim.key] ?? null;
        const stroke = score == null ? "#E5E7EB" : dim.color;
        const opacity = score == null ? 1 : 0.18 + 0.82 * ((score - 1) / 4);
        return (
          <path
            key={dim.key}
            d={`M ${110 - r} 112 A ${r} ${r} 0 0 1 ${110 + r} 112`}
            fill="none"
            stroke={stroke}
            strokeOpacity={opacity}
            strokeWidth="11"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

export function RainbowRatingSection({ placeId, placeName }: { placeId: string; placeName: string }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [scores, setScores] = useState<Scores>({});
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: summary } = useQuery({
    queryKey: ["rating-summary", placeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("place_rating_summary")
        .select("*")
        .eq("location_id", placeId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: myRating } = useQuery({
    queryKey: ["my-rating", placeId, user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("place_ratings")
        .select("*")
        .eq("location_id", placeId)
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Prefill the form with the user's previous answers when editing
  useEffect(() => {
    if (myRating) {
      const prev: Scores = {};
      for (const dim of RATING_DIMENSIONS) prev[dim.key] = myRating[dim.key];
      setScores(prev);
      setComment(myRating.comment || "");
    }
  }, [myRating]);

  const isComplete =
    summary &&
    summary.rating_count >= 3 &&
    RATING_DIMENSIONS.every((d) => (summary[d.key] ?? 0) >= 4);

  const openRate = () => {
    if (!user) { navigate("/auth"); return; }
    setShowDialog(true);
  };

  const handleSave = async () => {
    const answered = RATING_DIMENSIONS.some((d) => scores[d.key] != null);
    if (!answered) {
      toast({ title: "Rate at least one colour", description: "Answer whichever questions your visit lets you speak to.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("place_ratings").upsert(
        {
          location_id: placeId,
          user_id: user!.id,
          safety: scores.safety ?? null,
          staff: scores.staff ?? null,
          visibility: scores.visibility ?? null,
          facilities: scores.facilities ?? null,
          belonging: scores.belonging ?? null,
          community: scores.community ?? null,
          comment: comment.trim() || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "location_id,user_id" },
      );
      if (error) throw error;
      toast({ title: "Thank you 🌈", description: "Your rating helps keep the community safe and informed." });
      setShowDialog(false);
      queryClient.invalidateQueries({ queryKey: ["rating-summary", placeId] });
      queryClient.invalidateQueries({ queryKey: ["my-rating", placeId] });
    } catch (err) {
      console.error("Rating save failed:", err);
      toast({ title: "Couldn't save your rating", description: "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Rainbow rating</h2>
        {isComplete && (
          <Badge className="bg-rainbow-gradient text-white border-0">🌈 Complete rainbow</Badge>
        )}
      </div>

      <div className="flex flex-col items-center">
        <RainbowArc summary={summary} />
        <p className="text-xs text-muted-foreground -mt-1">
          {summary?.rating_count
            ? `${summary.rating_count} community rating${summary.rating_count === 1 ? "" : "s"} in the last 18 months`
            : "No community ratings yet — be the first"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {RATING_DIMENSIONS.map((dim) => (
          <div key={dim.key} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: dim.color }} aria-hidden="true" />
              {dim.label}
            </span>
            <span className="font-medium tabular-nums">
              {summary?.[dim.key] != null ? Number(summary[dim.key]).toFixed(1) : "—"}
            </span>
          </div>
        ))}
      </div>

      <Button size="sm" variant="outline" className="w-full" onClick={openRate}>
        <Star className="h-4 w-4 mr-1.5" aria-hidden="true" />
        {myRating ? "Update your rating" : "Rate your experience"}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rate {placeName}</DialogTitle>
            <DialogDescription>
              Answer from your own visit. Skip any colour you can't speak to —
              honest partial ratings beat guessed complete ones.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {RATING_DIMENSIONS.map((dim) => (
              <div key={dim.key} className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: dim.color }} aria-hidden="true" />
                  <span className="text-sm font-medium">{dim.label}</span>
                  {scores[dim.key] != null && (
                    <button
                      className="text-xs text-muted-foreground underline ml-auto"
                      onClick={() => setScores((s) => ({ ...s, [dim.key]: null }))}
                    >
                      clear
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{dim.question}</p>
                <div className="flex gap-1.5" role="radiogroup" aria-label={`${dim.label} score`}>
                  {[1, 2, 3, 4, 5].map((n) => {
                    const active = scores[dim.key] === n;
                    return (
                      <button
                        key={n}
                        role="radio"
                        aria-checked={active}
                        className="h-9 w-9 rounded-full border text-sm font-medium transition-colors"
                        style={active ? { backgroundColor: dim.color, borderColor: dim.color, color: "#fff" } : undefined}
                        onClick={() => setScores((s) => ({ ...s, [dim.key]: n }))}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <Textarea
              placeholder="Anything the community should know? (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover">
                {saving ? "Saving..." : "Save rating"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
