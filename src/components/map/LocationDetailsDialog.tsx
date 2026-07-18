
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Flag, Mail, MapPin, Phone, Heart } from "lucide-react";
import { mockPlaces } from "@/data/mockData";
import { useUser } from "@/contexts/UserContext";
import { useSavedPlaces } from "@/hooks/useSavedPlaces";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

type LocationDetailsProps = {
  location: typeof mockPlaces[0] | null;
  isOpen: boolean;
  onClose: () => void;
};

const REPORT_REASONS = [
  "Closed permanently",
  "Details are wrong",
  "Not LGBT+ friendly",
  "Safety concern",
  "Other",
];

export function LocationDetailsDialog({ location, isOpen, onClose }: LocationDetailsProps) {
  const navigate = useNavigate();
  const { user } = useUser();
  const { isSaved, toggleSave, isToggling } = useSavedPlaces();
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState<string>("");
  const [reportDetails, setReportDetails] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  if (!location) return null;

  const handleSaveClick = () => {
    if (!user) {
      onClose();
      navigate("/auth");
      return;
    }
    toggleSave(String(location.id));
  };

  const handleSubmitReport = async () => {
    if (!reportReason) {
      toast({ title: "Please choose a reason", variant: "destructive" });
      return;
    }
    setSubmittingReport(true);
    try {
      const { error } = await supabase.from("place_reports").insert({
        location_id: String(location.id),
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

  const handleOpenWebsite = (url: string) => {
    // Check if the URL has a protocol, if not add https://
    const websiteUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(websiteUrl, '_blank', 'noopener,noreferrer');
  };

  // Function to get the LGBT+ status badge
  const getLgbtStatusBadge = () => {
    if (!location.lgbt_status) return null;
    
    let badgeProps: {
      variant: "default" | "secondary" | "destructive" | "outline" | "lgbtOwned" | "lgbtManaged" | "ally";
      text: string;
    } = {
      variant: 'default',
      text: '',
    };
    
    switch(location.lgbt_status) {
      case 'lgbt_owned':
        badgeProps.variant = 'lgbtOwned';
        badgeProps.text = 'LGBT+ Owned';
        break;
      case 'lgbt_managed':
        badgeProps.variant = 'lgbtManaged';
        badgeProps.text = 'LGBT+ Managed';
        break;
      case 'ally':
        badgeProps.variant = 'ally';
        badgeProps.text = 'Ally';
        break;
      default:
        return null;
    }
    
    return (
      <Badge variant={badgeProps.variant} className="flex items-center gap-1">
        <Heart className="h-3 w-3" />
        {badgeProps.text}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{location.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-sm flex-wrap">
            <Badge variant="outline">{location.category}</Badge>
            <Badge variant="secondary">{location.type}</Badge>
            {getLgbtStatusBadge()}
            {location.verified ? (
              <Badge className="bg-green-100 text-green-800 border-green-300">✓ Verified</Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-800 border-amber-300">Community submitted</Badge>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {location.imageUrl && (
          <div 
            className="h-40 w-full rounded-md bg-muted bg-cover bg-center"
            style={{ backgroundImage: `url(${location.imageUrl})` }}
          />
        )}
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{location.description}</p>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Location</h4>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{location.location.address}</span>
              </div>
              {location.location.neighbourhood && (
                <div className="flex items-center gap-2 text-sm ml-6">
                  <span>{location.location.neighbourhood}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm ml-6">
                <span>{location.location.city}</span>
              </div>
            </div>
          </div>
          
          {location.contact && (location.contact.phone || location.contact.email || location.contact.website) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Contact</h4>
              <div className="space-y-1">
                {location.contact.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{location.contact.phone}</span>
                  </div>
                )}
                {location.contact.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>{location.contact.email}</span>
                  </div>
                )}
                {location.contact.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <ExternalLink className="h-4 w-4 text-primary" />
                    <button 
                      onClick={() => handleOpenWebsite(location.contact!.website!)} 
                      className="text-primary hover:underline text-left"
                    >
                      {location.contact.website.replace(/^https?:\/\/(www\.)?/, '')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {location.tags && location.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              
              {/* Always show type and category as tags if they aren't already in the tags array */}
              {!location.tags?.includes(location.type.toLowerCase()) && (
                <Badge variant="secondary" className="text-xs">
                  #{location.type.toLowerCase()}
                </Badge>
              )}
              
              {!location.tags?.includes(location.category.toLowerCase()) && (
                <Badge variant="secondary" className="text-xs">
                  #{location.category.toLowerCase()}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Report an issue */}
        {showReport ? (
          <div className="rounded-md border p-3 space-y-3 bg-muted/30">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Flag className="h-4 w-4" aria-hidden="true" /> Report an issue with this place
            </h4>
            <Select value={reportReason} onValueChange={setReportReason}>
              <SelectTrigger aria-label="Reason for report">
                <SelectValue placeholder="Choose a reason" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map(reason => (
                  <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                ))}
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
          </div>
        ) : (
          <button
            className="text-xs text-muted-foreground hover:text-foreground underline text-left"
            onClick={() => {
              if (!user) {
                onClose();
                navigate("/auth");
                return;
              }
              setShowReport(true);
            }}
          >
            Something wrong or unsafe about this listing? Report it.
          </button>
        )}

        <div className="flex justify-between items-center gap-2 mt-4">
          <Button
            variant={user && isSaved(String(location.id)) ? "default" : "outline"}
            onClick={handleSaveClick}
            disabled={isToggling}
            className={user && isSaved(String(location.id)) ? "bg-rainbow-gradient hover:bg-rainbow-gradient-hover" : ""}
          >
            <Heart
              className={`h-4 w-4 mr-2 ${user && isSaved(String(location.id)) ? "fill-current" : ""}`}
              aria-hidden="true"
            />
            {user && isSaved(String(location.id)) ? "Saved" : "Save"}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            {location.contact?.website && (
              <Button
                className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
                onClick={() => handleOpenWebsite(location.contact!.website!)}
              >
                <span className="flex items-center gap-1">
                  Visit Website <ExternalLink className="h-4 w-4" />
                </span>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
