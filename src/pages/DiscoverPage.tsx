
import { useState } from "react";
import { MapPin, Plus, Coffee, Music, Heart, ShoppingBag, Settings, Users, Grid, Stethoscope, Search, Locate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockPlaces } from "@/data/mockData";

// Define categories with their icons
const categories = [
  { name: "All", icon: Grid },
  { name: "Cafes", icon: Coffee },
  { name: "Bars", icon: Music },
  { name: "Nightlife", icon: Heart },
  { name: "Shopping", icon: ShoppingBag },
  { name: "Services", icon: Settings },
  { name: "Community", icon: Users },
  { name: "Healthcare", icon: Stethoscope }
];

export default function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get featured and recent places from mockPlaces
  const featuredPlaces = mockPlaces.filter(place => place.featured).slice(0, 5);
  const recentPlaces = [...mockPlaces].sort((a, b) => b.id - a.id).slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Discover</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
          >
            <MapPin className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Current Location</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Search</span>
          </Button>
        </div>
      </div>
      
      {/* Map Section - Large and prominent */}
      <div className="rounded-lg overflow-hidden h-[60vh] mb-6">
        <InteractiveMap className="h-full" />
      </div>
      
      {/* Categories Filter */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Explore By Category</h2>
        <ScrollArea className="w-full whitespace-nowrap pb-2" orientation="horizontal">
          <div className="flex items-center gap-2 mb-4 px-1">
            {categories.map(category => (
              <Badge 
                key={category.name} 
                variant={selectedCategory === category.name ? "default" : "outline"}
                className={`rounded-full cursor-pointer px-4 py-2 ${
                  selectedCategory === category.name
                    ? "bg-primary text-white"
                    : "bg-background hover:bg-muted/50"
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.name}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Featured Listings */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Featured Listings</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Added Recently</Button>
            <Button variant="outline" size="sm">Most Visited</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {featuredPlaces.map(place => (
            <Card key={place.id} className="overflow-hidden group cursor-pointer hover:shadow-md transition-all">
              <div 
                className="h-36 bg-cover bg-center relative" 
                style={{ backgroundImage: `url(${place.imageUrl || `https://picsum.photos/300/200?random=${place.id}`})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                <div className="absolute bottom-2 left-2">
                  {place.lgbt_status && (
                    <Badge variant={
                      place.lgbt_status === 'lgbt_owned' ? 'lgbtOwned' : 
                      place.lgbt_status === 'lgbt_managed' ? 'lgbtManaged' : 'ally'
                    } className="text-xs">
                      {place.lgbt_status === 'lgbt_owned' ? '🏳️‍🌈 LGBT+ Owned' : 
                       place.lgbt_status === 'lgbt_managed' ? '🏳️‍🌈 LGBT+ Managed' : '❤️ Ally'}
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold truncate">{place.name}</h3>
                <p className="text-sm text-muted-foreground">{place.category}</p>
                <div className="flex items-center mt-2 text-xs">
                  <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span className="truncate text-muted-foreground">{place.location.address || place.location.city}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Recently Added */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Recently Added</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {recentPlaces.map(place => (
            <Card key={place.id} className="overflow-hidden group cursor-pointer hover:shadow-md transition-all">
              <div 
                className="h-36 bg-cover bg-center relative" 
                style={{ backgroundImage: `url(${place.imageUrl || `https://picsum.photos/300/200?random=${place.id}`})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs bg-white/80">New</Badge>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold truncate">{place.name}</h3>
                <p className="text-sm text-muted-foreground">{place.category}</p>
                <div className="flex items-center mt-2 text-xs">
                  <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span className="truncate text-muted-foreground">{place.location.address || place.location.city}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
