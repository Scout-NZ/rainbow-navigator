
import { useState, useEffect } from "react";
import { MapPin, Grid, Coffee, Music, Heart, ShoppingBag, Settings, Users, Stethoscope, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationDetailsDialog } from "@/components/map/LocationDetailsDialog";
import { CategoryPlaceholderImage } from "@/components/ui/CategoryPlaceholderImage";

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
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  // Filter places based on selected category
  const filteredPlaces = selectedCategory === "All" 
    ? mockPlaces 
    : mockPlaces.filter(place => place.category === selectedCategory);
  
  // Featured places are a subset of filtered places
  const featuredPlaces = filteredPlaces.filter(place => place.featured).slice(0, 10);
  
  // Recent places are sorted by id (most recent first)
  const recentPlaces = [...filteredPlaces].sort((a, b) => b.id - a.id).slice(0, 10);
  
  // Handle place selection and show details
  const handlePlaceSelect = (place: any) => {
    setSelectedPlace(place);
    setShowDetailsDialog(true);
  };
  
  return (
    <div className="space-y-6">
      {/* Simple header */}
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
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Add Place</span>
          </Button>
        </div>
      </div>
      
      {/* View Mode Tabs */}
      <Tabs defaultValue="map" onValueChange={(value) => setViewMode(value as "map" | "list")}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="mt-0">
          {/* Map View */}
          <div className="rounded-lg overflow-hidden h-[60vh] mb-6 shadow-md">
            <InteractiveMap 
              className="h-full"
              categoryFilter={selectedCategory === "All" ? null : selectedCategory}
              lgbtStatusFilter={selectedLgbtStatus}
              onLocationSelect={handlePlaceSelect}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          {/* List View */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPlaces.map(place => {
                const colors = getCategoryColor(place.category);
                
                return (
                  <Card 
                    key={place.id} 
                    className="overflow-hidden group cursor-pointer hover:shadow-md transition-all h-full border-0 shadow"
                    onClick={() => handlePlaceSelect(place)}
                  >
                    <div className="h-40 bg-cover bg-center relative overflow-hidden">
                      {place.imageUrl ? (
                        <img 
                          src={place.imageUrl || `https://picsum.photos/300/200?random=${place.id}`} 
                          alt={place.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parentElement = target.parentElement;
                            if (parentElement) {
                              const placeholderElement = document.createElement('div');
                              placeholderElement.className = 'w-full h-full';
                              parentElement.appendChild(placeholderElement);
                              
                              // Use the CategoryPlaceholderImage
                              const categoryImg = document.createElement('img');
                              const imgSrc = categoryColors[place.category] 
                                ? `https://images.unsplash.com/photo-1573592371950-348a8f1d9f38?q=80&w=1000&auto=format`
                                : `https://images.unsplash.com/photo-1573592371950-348a8f1d9f38?q=80&w=1000&auto=format`;
                              categoryImg.src = imgSrc;
                              categoryImg.alt = place.category;
                              categoryImg.className = 'w-full h-full object-cover';
                              placeholderElement.appendChild(categoryImg);
                            }
                          }}
                        />
                      ) : (
                        <CategoryPlaceholderImage 
                          category={place.category} 
                          className="w-full h-full transition-transform group-hover:scale-105"
                        />
                      )}
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
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
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
      {featuredPlaces.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Featured {selectedCategory !== 'All' ? selectedCategory : ""}</h2>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {featuredPlaces.map(place => {
                const colors = getCategoryColor(place.category);
                
                return (
                  <CarouselItem key={place.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <Card 
                      className="overflow-hidden group cursor-pointer hover:shadow-md transition-all h-full border-0 shadow"
                      onClick={() => handlePlaceSelect(place)}
                    >
                      <div className="h-48 bg-cover bg-center relative">
                        {place.imageUrl ? (
                          <img 
                            src={place.imageUrl || `https://picsum.photos/300/200?random=${place.id}`} 
                            alt={place.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              // Insert CategoryPlaceholderImage as fallback
                              const div = document.createElement('div');
                              div.className = 'w-full h-full';
                              (e.target as HTMLImageElement).parentElement?.appendChild(div);
                              
                              // Create placeholder with category-appropriate image
                              const img = document.createElement('img');
                              img.src = `https://images.unsplash.com/photo-1573592371950-348a8f1d9f38?q=80&w=1000&auto=format`;
                              img.alt = place.category;
                              img.className = 'w-full h-full object-cover';
                              div.appendChild(img);
                            }}
                          />
                        ) : (
                          <CategoryPlaceholderImage 
                            category={place.category} 
                            className="w-full h-full transition-transform group-hover:scale-105"
                          />
                        )}
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
      )}
      
      {/* Recently Added - Horizontal Carousel */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Recently Added {selectedCategory !== 'All' ? selectedCategory : ""}</h2>
        
        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {recentPlaces.map(place => {
              const colors = getCategoryColor(place.category);
              
              return (
                <CarouselItem key={place.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card 
                    className="overflow-hidden group cursor-pointer hover:shadow-md transition-all h-full border-0 shadow"
                    onClick={() => handlePlaceSelect(place)}
                  >
                    <div className="h-48 bg-cover bg-center relative">
                      {place.imageUrl ? (
                        <img 
                          src={place.imageUrl || `https://picsum.photos/300/200?random=${place.id}`} 
                          alt={place.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            // Add CategoryPlaceholderImage
                            const container = document.createElement('div');
                            container.className = 'w-full h-full';
                            (e.target as HTMLImageElement).parentElement?.appendChild(container);
                            
                            // Use fallback image based on category
                            const fallbackImg = document.createElement('img');
                            fallbackImg.src = `https://images.unsplash.com/photo-1573592371950-348a8f1d9f38?q=80&w=1000&auto=format`;
                            fallbackImg.alt = place.category;
                            fallbackImg.className = 'w-full h-full object-cover';
                            container.appendChild(fallbackImg);
                          }}
                        />
                      ) : (
                        <CategoryPlaceholderImage 
                          category={place.category} 
                          className="w-full h-full transition-transform group-hover:scale-105"
                        />
                      )}
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
      
      {/* Location Details Dialog */}
      <LocationDetailsDialog 
        location={selectedPlace} 
        isOpen={showDetailsDialog} 
        onClose={() => setShowDetailsDialog(false)}
      />
    </div>
  );
}
