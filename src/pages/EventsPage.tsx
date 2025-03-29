
import { useState } from "react";
import { Calendar, Filter, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { mockEvents } from "@/data/mockData";
import { EventCard } from "@/components/events/EventCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyFree, setShowOnlyFree] = useState(false);
  const [dateFilter, setDateFilter] = useState<"all" | "upcoming" | "today" | "thisWeek" | "thisMonth">("all");
  
  const categories = ["All", "Pride", "Activism", "Social", "Culture", "Family", "Nightlife", "Sports", "Educational"];
  
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    
    const matchesPrice = !showOnlyFree || event.price === "Free";
    
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isUpcoming = eventDate >= today;
    
    const isToday = eventDate.getDate() === today.getDate() &&
                   eventDate.getMonth() === today.getMonth() &&
                   eventDate.getFullYear() === today.getFullYear();
    
    const thisWeekEnd = new Date(today);
    thisWeekEnd.setDate(today.getDate() + (7 - today.getDay()));
    
    const isThisWeek = eventDate >= today && eventDate <= thisWeekEnd;
    
    const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const isThisMonth = eventDate >= today && eventDate <= thisMonthEnd;
    
    let matchesDate = true;
    if (dateFilter === "upcoming") matchesDate = isUpcoming;
    else if (dateFilter === "today") matchesDate = isToday;
    else if (dateFilter === "thisWeek") matchesDate = isThisWeek;
    else if (dateFilter === "thisMonth") matchesDate = isThisMonth;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesDate;
  });
  
  return (
    <div className="pb-4">
      <div className="flex justify-end items-center mb-4">
        <Button 
          size="sm"
          className="rounded-full bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input 
          type="search" 
          placeholder="Search events..." 
          className="md:col-span-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full gap-1">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Date</h4>
                <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All events</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="thisWeek">This week</SelectItem>
                    <SelectItem value="thisMonth">This month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="free-only">Free events only</Label>
                  <Switch 
                    id="free-only" 
                    checked={showOnlyFree}
                    onCheckedChange={setShowOnlyFree}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap pb-2" orientation="horizontal">
        <div className="flex items-center gap-2 mb-4 px-1">
          {categories.map(category => (
            <Badge 
              key={category} 
              variant={selectedCategory === category ? "default" : "outline"}
              className={`rounded-full cursor-pointer px-4 py-2 ${
                selectedCategory === category 
                  ? "bg-primary text-white"
                  : "bg-background hover:bg-muted/50"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </ScrollArea>
      
      <Tabs defaultValue="list">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="list" className="flex-1">List</TabsTrigger>
          <TabsTrigger value="calendar" className="flex-1">Calendar</TabsTrigger>
          <TabsTrigger value="map" className="flex-1">Map</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-0">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No events found</h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? "Try changing your search query or filters"
                    : "No events match your current filters"
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-0">
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Calendar view coming soon</h3>
              <p className="text-muted-foreground">
                We're working on an improved calendar experience
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="map" className="mt-0">
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Map view coming soon</h3>
              <p className="text-muted-foreground">
                Explore events based on location
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
