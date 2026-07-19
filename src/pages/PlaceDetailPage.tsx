import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft, ExternalLink, Flag, Heart, Mail, MapPin, Navigation, Phone, Share2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { transformLocation } from "@/components/map/mapUtils";
import { useUser } from "@/contexts/UserContext";
import { useSavedPlaces } from "@/hooks/useSavedPlaces";
import { toast } from "@/components/ui/use-toast";
import { RainbowRatingSection } from "@/components/places/RainbowRating";
import { CheckInSection } from "@/components/places/CheckIn";

const REPORT_REASONS = [
  "Closed permanently",
  "Details are wrong",
  "Not LGBT+ friendly",
  "Safety concern",
  "Other",
];

// Full place page, AllTrails-style: hero image, title block, at-a-glance
// chips, one action row, then description / contact / trust info.
export default function PlaceDetailPage() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { isSaved, toggleSave, isToggling } = useSavedPlaces();

  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  const { data: place, isLoading } = useQuery({
    queryKey: ["place", placeId],
    enabled: !!placeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("id", placeId!)
        .maybeSingle();
      if (error) throw error;
      return data ? transformLocation(data) : null;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!place) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-muted-foreground">We couldn't find that place.</p>
        <Button asChild variant="outline"><Link to="/">Back to Explore</Link></Button>
      </div>
    );
  }

  const saved = user && isSaved(String(place.id));
  const hasCoords = place.location.lat && place.location.lng;
  const directionsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${place.location.lat},${place.location.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.location.city || ""}`)}`;

  const handleSave = () => {
    if (!user) { navigate("/auth"); return; }
    toggleSave(String(place.id));
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: place.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied to clipboard" });
      }
    } catch {
      /* user cancelled share — nothing to do */
    }
  };

  const openWebsite = () => {
    const url = place.contact.website.startsWith("http")
      ? place.contact.website
      : `https://${place.contact.website}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmitReport = async () => {
    if (!reportReason) {
      toast({ title: "Please choose a reason", variant: "destructive" });
      return;
    }
    setSubmittingReport(true);
    try {
      const { error } = await supabase.from("place_reports").insert({
        location_id: String(place.id),
        reported_by: user!.id,
        reason: reportReason,
        details: reportDetails || null,
      });
      if (error) throw error;
      toast({
        title: "Thank you for the report",
        description: "We review every report to keep the map safe and accurate.",
      });
      setShowReport(false);
      setReportReason("");
      setReportDetails("");
    } catch (e) {
      console.error("Report failed:", e);
      toast({ title: "Couldn't send the report", description: "Please try again.", variant: "destructive" });
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {/* Hero */}
      <div className="relative -mx-4 md:mx-0 md:rounded-xl overflow-hidden">
        <div
          className="h-56 md:h-72 bg-cover bg-center"
          style={{ backgroundImage: `url(${place.imageUrl})` }}
        />
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="absolute top-3 left-3 h-9 w-9 rounded-full bg-white/90 shadow flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-gray-800" />
        </button>
      </div>

      {/* Title block */}
      <div className="mt-4 space-y-2">
        <h1 className="text-2xl font-bold leading-tight">{place.name}</h1>
        <p className="text-muted-foreground flex items-center gap-1 text-sm">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {[place.location.address, place.location.city].filter(Boolean).join(", ") || "Aotearoa New Zealand"}
        </p>

        {/* At-a-glance chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Badge variant="outline">{place.category}</Badge>
          {place.lgbt_status === "lgbt_owned" && <Badge variant="lgbtOwned">🏳️‍🌈 LGBT+ Owned</Badge>}
          {place.lgbt_status === "lgbt_managed" && <Badge variant="lgbtManaged">🏳️‍🌈 LGBT+ Managed</Badge>}
          {place.lgbt_status === "ally" && <Badge variant="ally">❤️ Ally</Badge>}
          {place.verified ? (
            <Badge className="bg-green-100 text-green-800 border-green-300">✓ Verified</Badge>
          ) : (
            <Badge className="bg-amber-100 text-amber-800 border-amber-300">Community submitted</Badge>
          )}
        </div>
      </div>

      {/* Action row */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        <Button
          variant={saved ? "default" : "outline"}
          className={`flex-col h-auto py-2 gap-1 ${saved ? "bg-rainbow-gradient hover:bg-rainbow-gradient-hover" : ""}`}
          onClick={handleSave}
          disabled={isToggling}
        >
          <Heart className={`h-5 w-5 ${saved ? "fill-current" : ""}`} aria-hidden="true" />
          <span className="text-xs">{saved ? "Saved" : "Save"}</span>
        </Button>
        <Button variant="outline" className="flex-col h-auto py-2 gap-1" asChild>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
            <Navigation className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs">Directions</span>
          </a>
        </Button>
        <Button
          variant="outline"
          className="flex-col h-auto py-2 gap-1"
          onClick={openWebsite}
          disabled={!place.contact.website}
        >
          <ExternalLink className="h-5 w-5" aria-hidden="true" />
          <span className="text-xs">Website</span>
        </Button>
        <Button variant="outline" className="flex-col h-auto py-2 gap-1" onClick={handleShare}>
          <Share2 className="h-5 w-5" aria-hidden="true" />
          <span className="text-xs">Share</span>
        </Button>
      </div>

      {/* Check in — the community activity signal */}
      <CheckInSection
        placeId={String(place.id)}
        placeName={place.name}
        lat={place.location.lat}
        lng={place.location.lng}
      />

      {/* Community rainbow rating */}
      <RainbowRatingSection placeId={String(place.id)} placeName={place.name} />

      {/* Unverified notice */}
      {!place.verified && (
        <Card className="mt-4 border-amber-200 bg-amber-50">
          <CardContent className="p-3 text-sm text-amber-900">
            This place was suggested by the community and hasn't been re-verified
            recently — details may have changed, so check before you visit.
          </CardContent>
        </Card>
      )}

      {/* Description */}
      {place.description && (
        <div className="mt-5 space-y-2">
          <h2 className="font-semibold">About</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{place.description}</p>
        </div>
      )}

      {/* Contact */}
      {(place.contact.phone || place.contact.email) && (
        <div className="mt-5 space-y-2">
          <h2 className="font-semibold">Contact</h2>
          <div className="space-y-1.5 text-sm">
            {place.contact.phone && (
              <a href={`tel:${place.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-primary">
                <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
                {place.contact.phone}
              </a>
            )}
            {place.contact.email && (
              <a href={`mailto:${place.contact.email}`} className="flex items-center gap-2 hover:text-primary">
                <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                {place.contact.email}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Tags */}
      {place.tags?.length > 0 && (
        <div className="mt-5 space-y-2">
          <h2 className="font-semibold">Tags</h2>
          <div className="flex flex-wrap gap-1">
            {place.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Report */}
      <div className="mt-6">
        {showReport ? (
          <Card>
            <CardContent className="p-3 space-y-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Flag className="h-4 w-4" aria-hidden="true" /> Report an issue with this place
              </h3>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger aria-label="Reason for report">
                  <SelectValue placeholder="Choose a reason" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Anything else we should know? (optional)"
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowReport(false)}>Cancel</Button>
                <Button size="sm" onClick={handleSubmitReport} disabled={submittingReport}>
                  {submittingReport ? "Sending..." : "Send report"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <button
            className="text-xs text-muted-foreground hover:text-foreground underline"
            onClick={() => {
              if (!user) { navigate("/auth"); return; }
              setShowReport(true);
            }}
          >
            Something wrong or unsafe about this listing? Report it.
          </button>
        )}
      </div>
    </div>
  );
}
