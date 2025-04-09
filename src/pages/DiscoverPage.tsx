
import { useState } from "react";
import { Grid, Coffee, Music, Heart, ShoppingBag, Settings, Users, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { mockPlaces } from "@/data/mockData";
import { Button } from "@/components/ui/button";

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

// Define category color mapping
const categoryColors: Record<string, { bg: string, text: string }> = {
  "Cafes": { bg: "bg-orange-100", text: "text-orange-800" },
  "Bars": { bg: "bg-blue-100", text: "text-blue-800" },
  "Nightlife": { bg: "bg-pink-100", text: "text-pink-800" },
  "Shopping": { bg: "bg-yellow-100", text: "text-yellow-800" },
  "Services": { bg: "bg-purple-100", text: "text-purple-800" },
  "Community": { bg: "bg-green-100", text: "text-green-800" },
  "Healthcare": { bg: "bg-cyan-100", text: "text-cyan-800" },
  "default": { bg: "bg-gray-100", text: "text-gray-800" }
};

// Function to get color based on category
const getCategoryColor = (category: string) => {
  return categoryColors[category] || categoryColors.default;
};

export default function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLgbtStatus, setSelectedLgbtStatus] = useState<string | null>(null);
  
  // Get featured and recent places from mockPlaces
  const featuredPlaces = mockPlaces.filter(place => place.featured).slice(0, 10);
  const recentPlaces = [...mockPlaces].sort((a, b) => b.id - a.id).slice(0, 10);
  
  return (
    <div className="space-y-6">
      {/* Simple header - removed the buttons */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Discover</h1>
      </div>
      
      {/* Map Section - Large and prominent */}
      <div className="rounded-lg overflow-hidden h-[75vh] mb-6 shadow-md">
        <InteractiveMap 
          className="h-full"
          categoryFilter={selectedCategory === "All" ? null : selectedCategory}
          lgbtStatusFilter={selectedLgbtStatus}
        />
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
      
      {/* Featured Listings - Horizontal Carousel */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Featured Trending</h2>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Added Recently</Button>
            <Button variant="default" size="sm">Most Visited</Button>
          </div>
        </div>
        
        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {featuredPlaces.map(place => {
              const colors = getCategoryColor(place.category);
              
              return (
                <CarouselItem key={place.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card className="overflow-hidden group cursor-pointer hover:shadow-md transition-all h-full border-0 shadow">
                    <div 
                      className="h-48 bg-cover bg-center relative" 
                      style={{ backgroundImage: `url(${place.imageUrl || `https://picsum.photos/300/200?random=${place.id}`})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
                      <div className="absolute top-2 left-2">
                        <h3 className="text-white font-bold text-lg">{place.name}</h3>
                      </div>
                      {place.verified && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            ✓ Verified
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className={`p-4 ${colors.bg}`}>
                      <div className="flex justify-between items-center">
                        <p className={`font-semibold ${colors.text}`}>{place.category}</p>
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
                      <p className={`text-sm ${colors.text}`}>{place.location.city}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-1" />
          <CarouselNext className="right-1" />
        </Carousel>
      </div>
      
      {/* Recently Added - Horizontal Carousel */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Recently Added</h2>
        
        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {recentPlaces.map(place => {
              const colors = getCategoryColor(place.category);
              
              return (
                <CarouselItem key={place.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card className="overflow-hidden group cursor-pointer hover:shadow-md transition-all h-full border-0 shadow">
                    <div 
                      className="h-48 bg-cover bg-center relative" 
                      style={{ backgroundImage: `url(${place.imageUrl || `https://picsum.photos/300/200?random=${place.id}`})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs bg-white/80">New</Badge>
                      </div>
                      {place.verified && (
                        <div className="absolute top-10 right-2">
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            ✓ Verified
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className={`p-4 ${colors.bg}`}>
                      <h3 className={`font-bold ${colors.text}`}>{place.name}</h3>
                      <p className={`text-sm ${colors.text}`}>{place.location.city}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-1" />
          <CarouselNext className="right-1" />
        </Carousel>
      </div>
    </div>
  );
}
