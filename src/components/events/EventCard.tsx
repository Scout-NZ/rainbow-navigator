
import { Calendar, Clock, MapPin } from "lucide-react";
import { Event } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function EventCard({ event }: { event: Event }) {
  // Format date to display month and day
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="card-hover overflow-hidden">
      <div 
        className="h-40 bg-muted bg-cover bg-center relative"
        style={{ 
          backgroundImage: event.imageUrl 
            ? `url(${event.imageUrl})` 
            : undefined 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <div className="absolute top-2 left-2">
          <Badge className="bg-rainbow-gradient text-white border-0">
            {event.category}
          </Badge>
        </div>
        
        {event.price && (
          <div className="absolute top-2 right-2">
            <Badge variant={event.price === "Free" ? "outline" : "secondary"} className="border-white text-white backdrop-blur-sm bg-black/30">
              {event.price}
            </Badge>
          </div>
        )}
        
        <div className="absolute bottom-2 left-3 right-3">
          <h3 className="text-white font-semibold text-lg line-clamp-1">{event.title}</h3>
        </div>
      </div>
      
      <CardContent className="p-3">
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>{formatDate(event.date)}</span>
            <Clock className="h-4 w-4 ml-3 mr-2 text-primary" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span className="line-clamp-1">{event.location.name}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{event.description}</p>
        
        <div className="flex gap-1 mt-2 flex-wrap">
          {event.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-between gap-2">
        <Button variant="outline" size="sm" className="w-1/2">Details</Button>
        <Button size="sm" className="w-1/2 bg-rainbow-gradient hover:bg-rainbow-gradient-hover">
          Attend ({event.attendees})
        </Button>
      </CardFooter>
    </Card>
  );
}
