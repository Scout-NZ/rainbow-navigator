
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
import { Link } from "react-router-dom";
import { useLocations } from "@/components/map/useLocations";
import { getCityCoordinates } from "@/components/map/mapUtils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, ShieldCheck } from "lucide-react";

const CITY_OPTIONS = [
  "Wellington", "Auckland", "Christchurch", "Hamilton", "Tauranga",
  "Dunedin", "Napier", "Nelson", "Palmerston North", "Porirua",
  "Whanganui", "Whangarei", "Invercargill", "Timaru",
];

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
  const [selectedCity, setSelectedCity] = useState("Wellington");

  // Real places from the database: verified ones are featured, and
  // community-submitted (unverified) ones get their own honest section.
  const { filteredPlaces: allPlaces } = useLocations({});
  const featuredPlaces = allPlaces.filter(place => place.verified).slice(0, 10);
  const communityPlaces = allPlaces.filter(place => !place.verified).slice(0, 10);
  
  return (
    <div className="space-y-6">
      {/* Header with city switcher and key actions */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Discover</h1>
        <div className="flex items-center gap-2">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-[160px]" aria-label="Choose a city">
              <MapPin className="h-4 w-4 mr-1 text-primary" aria-hidden="true" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CITY_OPTIONS.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild variant="outline" size="sm">
            <Link to="/safety">
              <ShieldCheck className="h-4 w-4 mr-1" aria-hidden="true" />
              Safety
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover">
            <Link to="/suggest">Suggest a place</Link>
          </Button>
        </div>
      </div>

      {/* Map Section - Large and prominent */}
      <div className="rounded-lg overflow-hidden h-[75vh] mb-6 shadow-md">
        <InteractiveMap
          className="h-full"
          defaultLocation={getCityCoordinates(selectedCity)}
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
          <h2 className="text-xl font-bold">Verified Places</h2>
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
                      style={{ backgroundImage: `url(${place.imageUrl})` }}
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
      
      {/* Community submitted - Horizontal Carousel */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">Community Submitted</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Suggested by community members — details not yet re-verified by us.
        </p>

        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {communityPlaces.map(place => {
              const colors = getCategoryColor(place.category);

              return (
                <CarouselItem key={place.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card className="overflow-hidden group hover:shadow-md transition-all h-full border-0 shadow">
                    <div
                      className="h-48 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${place.imageUrl})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
                      <div className="absolute top-2 left-2">
                        <h3 className="text-white font-bold text-lg">{place.name}</h3>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                          Community submitted
                        </Badge>
                      </div>
                    </div>
                    <CardContent className={`p-4 ${colors.bg}`}>
                      <p className={`font-semibold ${colors.text}`}>{place.category}</p>
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
