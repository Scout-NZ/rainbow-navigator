import { ExternalLink, MapPin, Phone } from "lucide-react";
import { Resource } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Update the Resource type to include optional neighbourhood
type ResourceWithNeighbourhood = Resource & {
  location?: {
    address: string;
    city: string;
    lat: number;
    lng: number;
    neighbourhood?: string;
  };
};

export function ResourceCard({ resource }: { resource: ResourceWithNeighbourhood }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <Card className="card-hover overflow-hidden">
        <CardContent className="p-3 pt-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <Badge className="mb-2 bg-rainbow-gradient text-white border-0">
                {resource.category}
              </Badge>
              <h3 className="font-semibold line-clamp-1">{resource.title}</h3>
              <p className="text-sm text-muted-foreground">{resource.provider}</p>
            </div>
            
            {resource.imageUrl && (
              <div 
                className="h-12 w-12 rounded-lg bg-muted bg-cover bg-center"
                style={{ backgroundImage: `url(${resource.imageUrl})` }}
              />
            )}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{resource.description}</p>
          
          <div className="space-y-1">
            {resource.location && (
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span className="line-clamp-1">{resource.location.address}, {resource.location.city}</span>
              </div>
            )}
            
            {resource.contact.phone && (
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                <span>{resource.contact.phone}</span>
              </div>
            )}
            
            {resource.contact.website && (
              <div className="flex items-center text-sm">
                <ExternalLink className="h-4 w-4 mr-2 text-primary" />
                <a href="#" className="text-primary hover:underline truncate">
                  {resource.contact.website.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </div>
            )}
          </div>
          
          <div className="flex gap-1 mt-3 flex-wrap">
            {resource.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="p-3 pt-0 flex justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-1/2"
            onClick={() => setShowDetails(true)}
          >
            More Info
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  className="w-1/2 bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
                  onClick={() => window.open(`tel:${resource.contact.phone}`)}
                  disabled={!resource.contact.phone}
                >
                  Contact
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {resource.contact.phone ? `Call ${resource.contact.phone}` : "No contact information available"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{resource.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {resource.provider}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {resource.imageUrl && (
              <div 
                className="h-40 w-full rounded-lg bg-muted bg-cover bg-center"
                style={{ backgroundImage: `url(${resource.imageUrl})` }}
              />
            )}
            
            <div>
              <h4 className="text-sm font-semibold mb-1">Description</h4>
              <p className="text-sm">{resource.description || "No description available."}</p>
            </div>
            
            {resource.location && (
              <div>
                <h4 className="text-sm font-semibold mb-1">Location</h4>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <span>
                    {resource.location.address}, 
                    {resource.location.city && ` ${resource.location.city}`}
                    {resource.location.neighbourhood && ` (${resource.location.neighbourhood})`}
                  </span>
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-semibold mb-1">Contact Information</h4>
              
              {resource.contact.phone && (
                <div className="flex items-center text-sm mb-2">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  <a 
                    href={`tel:${resource.contact.phone}`} 
                    className="text-primary hover:underline"
                  >
                    {resource.contact.phone}
                  </a>
                </div>
              )}
              
              {resource.contact.email && (
                <div className="flex items-center text-sm mb-2">
                  <ExternalLink className="h-4 w-4 mr-2 text-primary" />
                  <a 
                    href={`mailto:${resource.contact.email}`} 
                    className="text-primary hover:underline break-all"
                  >
                    {resource.contact.email}
                  </a>
                </div>
              )}
              
              {resource.contact.website && (
                <div className="flex items-center text-sm">
                  <ExternalLink className="h-4 w-4 mr-2 text-primary" />
                  <a 
                    href={resource.contact.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline break-all"
                  >
                    {resource.contact.website.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </div>
              )}
            </div>
            
            {resource.tags && resource.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-1">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {resource.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
              onClick={() => {
                if (resource.contact.website) {
                  window.open(resource.contact.website, '_blank');
                } else if (resource.contact.phone) {
                  window.open(`tel:${resource.contact.phone}`);
                } else if (resource.contact.email) {
                  window.open(`mailto:${resource.contact.email}`);
                }
              }}
              disabled={!resource.contact.website && !resource.contact.phone && !resource.contact.email}
            >
              Contact
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
