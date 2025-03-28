
import { useState } from "react";
import { Calendar, Filter, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "@/components/events/EventCard";
import { mockEvents } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InteractiveMap } from "@/components/map/InteractiveMap";

export default function EventsPage() {
  const [view, setView] = useState<"list" | "calendar" | "map">("list");
  
  // Group events by date
  const eventsByDate = mockEvents.reduce((groups, event) => {
    const date = event.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, typeof mockEvents>);
  
  // Format date headers
  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }
  };
  
  return (
    <div className="pb-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold rainbow-text">Events</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button 
            size="sm"
            className="rounded-full bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        <Badge variant="outline" className="rounded-full bg-background hover:bg-muted/50 cursor-pointer">
          All
        </Badge>
        {["Pride", "Activism", "Social", "Cultural", "Family", "Nightlife", "Sports", "Educational"].map(category => (
          <Badge 
            key={category} 
            variant="outline" 
            className="rounded-full bg-background hover:bg-muted/50 cursor-pointer whitespace-nowrap"
          >
            {category}
          </Badge>
        ))}
      </div>
      
      <div className="bg-muted/30 border rounded-lg p-2 flex gap-2 mb-6">
        <Button
          variant={view === "list" ? "default" : "ghost"}
          size="sm"
          className="flex-1"
          onClick={() => setView("list")}
        >
          List
        </Button>
        <Button
          variant={view === "calendar" ? "default" : "ghost"}
          size="sm"
          className="flex-1"
          onClick={() => setView("calendar")}
        >
          Calendar
        </Button>
        <Button
          variant={view === "map" ? "default" : "ghost"}
          size="sm"
          className="flex-1"
          onClick={() => setView("map")}
        >
          Map
        </Button>
      </div>
      
      {view === "list" && (
        <div className="space-y-6">
          {Object.entries(eventsByDate)
            .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
            .map(([date, events]) => (
              <div key={date}>
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  {formatDateHeader(date)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))
          }
        </div>
      )}
      
      {view === "calendar" && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-center text-sm font-medium">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => {
                const day = i - 3; // Starting from previous month
                const isCurrentMonth = day >= 0 && day < 30;
                const hasEvents = isCurrentMonth && [5, 10, 15, 25].includes(day);
                
                return (
                  <div 
                    key={i}
                    className={`
                      aspect-square flex flex-col items-center justify-center rounded-md text-sm
                      ${isCurrentMonth ? "bg-background" : "bg-muted/30 text-muted-foreground"}
                      ${hasEvents ? "rainbow-border" : "border"}
                      ${day === 14 ? "bg-primary/10" : ""}
                      hover:bg-muted/50 cursor-pointer transition-colors
                    `}
                  >
                    <span>{isCurrentMonth ? day + 1 : day < 0 ? 30 + day + 1 : day - 29}</span>
                    {hasEvents && (
                      <div className="h-1 w-1 bg-primary rounded-full mt-1"></div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 space-y-2">
              <h3 className="text-sm font-medium mb-2">Upcoming Events</h3>
              {mockEvents.slice(0, 3).map(event => (
                <Card key={event.id} className="card-hover">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="bg-muted rounded-md p-2 text-center min-w-14">
                      <div className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-lg font-bold">
                        {new Date(event.date).getDate()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{event.title}</h4>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate">{event.location.name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {view === "map" && (
        <div className="space-y-4">
          <InteractiveMap className="h-96" />
          
          <h3 className="text-sm font-medium">Nearby Events</h3>
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className="flex gap-3">
              {mockEvents.map(event => (
                <Card key={event.id} className="card-hover min-w-[250px] max-w-[250px]">
                  <div 
                    className="h-32 bg-muted bg-cover bg-center relative"
                    style={{ backgroundImage: event.imageUrl ? `url(${event.imageUrl})` : undefined }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-2 left-2">
                      <h3 className="text-white font-semibold">{event.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex items-center text-sm mb-1">
                      <Calendar className="h-4 w-4 mr-1 text-primary" />
                      <span>
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="truncate">{event.location.name}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
