
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { mockPlaces } from "@/data/mockData";

type LocationDetailsProps = {
  location: typeof mockPlaces[0] | null;
  isOpen: boolean;
  onClose: () => void;
};

export function LocationDetailsDialog({ location, isOpen, onClose }: LocationDetailsProps) {
  if (!location) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{location.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-sm">
            <Badge variant="outline">{location.category}</Badge>
            <Badge variant="secondary">{location.type}</Badge>
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
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{location.location.address}, {location.location.city}</span>
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
                    <a 
                      href={location.contact.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {location.contact.website.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {location.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {location.contact?.website && (
            <Button className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover">
              <a 
                href={location.contact.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                Visit Website <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
