
import { ExternalLink, MapPin, Phone } from "lucide-react";
import { Resource } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
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
        <Button variant="outline" size="sm" className="w-1/2">More Info</Button>
        <Button size="sm" className="w-1/2 bg-rainbow-gradient hover:bg-rainbow-gradient-hover">Contact</Button>
      </CardFooter>
    </Card>
  );
}
