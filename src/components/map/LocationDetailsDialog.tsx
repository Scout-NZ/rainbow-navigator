
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Mail, MapPin, Phone, Heart, Clock, Info } from "lucide-react";
import { mockPlaces } from "@/data/mockData";
import { CategoryPlaceholderImage } from "@/components/ui/CategoryPlaceholderImage";

type LocationDetailsProps = {
  location: typeof mockPlaces[0] | null;
  isOpen: boolean;
  onClose: () => void;
};

export function LocationDetailsDialog({ location, isOpen, onClose }: LocationDetailsProps) {
  if (!location) return null;

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
            {location.verified && (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                ✓ Verified
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="h-48 w-full rounded-md bg-muted overflow-hidden">
          {location.imageUrl ? (
            <img 
              src={location.imageUrl}
              alt={location.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parentElement = target.parentElement;
                if (parentElement) {
                  const placeholderDiv = document.createElement('div');
                  placeholderDiv.className = 'w-full h-full';
                  parentElement.appendChild(placeholderDiv);
                  
                  // Render the CategoryPlaceholderImage using DOM operations
                  const img = document.createElement('img');
                  img.src = `https://images.unsplash.com/photo-1573592371950-348a8f1d9f38?q=80&w=1000&auto=format`;
                  img.alt = location.category;
                  img.className = 'w-full h-full object-cover';
                  placeholderDiv.appendChild(img);
                }
              }}
            />
          ) : (
            <CategoryPlaceholderImage 
              category={location.category} 
              className="w-full h-full"
            />
          )}
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{location.description}</p>
          
          {location.hours && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Hours
              </h4>
              <p className="text-sm text-muted-foreground ml-6">
                {location.hours}
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Location
            </h4>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm ml-6">
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
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" /> Contact
              </h4>
              <div className="space-y-1">
                {location.contact.phone && (
                  <div className="flex items-center gap-2 text-sm ml-6">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{location.contact.phone}</span>
                  </div>
                )}
                {location.contact.email && (
                  <div className="flex items-center gap-2 text-sm ml-6">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>{location.contact.email}</span>
                  </div>
                )}
                {location.contact.website && (
                  <div className="flex items-center gap-2 text-sm ml-6">
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
        
        <div className="flex justify-end gap-2 mt-4">
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
      </DialogContent>
    </Dialog>
  );
}
