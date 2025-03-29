
import { useState } from "react";
import { MapPin, Plus, Coffee, Music, Heart, ShoppingBag, Settings, Users, Grid, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { mockPlaces } from "@/data/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { LocationDetailsDialog } from "@/components/map/LocationDetailsDialog";
import { toast } from "@/components/ui/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem 
} from "@/components/ui/dropdown-menu";

// Default location (Auckland, New Zealand)
const DEFAULT_LOCATION = { lat: -36.8485, lng: 174.7633 };

export default function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<typeof mockPlaces[0] | null>(null);
  const [showLocationDetails, setShowLocationDetails] = useState(false);
  const [lgbtFilter, setLgbtFilter] = useState<string | null>(null);
  
  // Filter businesses only
  const businesses = mockPlaces.filter(place => place.type === 'business');
  
  // Function to handle category selection
  const handleCategorySelect = (category: string) => {
    // If the same category is clicked again, clear the filter
    setSelectedCategory(prevCategory => 
      prevCategory === category ? null : category
    );
    
    // Show toast notification for category selection
    toast({
      title: category ? `Showing ${category}` : "Showing all locations",
      description: "Filter applied to map and listings",
    });
  };

  // Function to clear category filter
  const handleViewAll = () => {
    setSelectedCategory(null);
    
    toast({
      title: "Showing all locations",
      description: "Filter cleared",
    });
  };

  // Function to open location details
  const handleOpenLocationDetails = (location: typeof mockPlaces[0]) => {
    setSelectedLocation(location);
    setShowLocationDetails(true);
  };

  // Function to handle LGBT+ status filter
  const handleLgbtFilterChange = (value: string) => {
    if (value === "all") {
      setLgbtFilter(null);
      toast({
        title: "Showing all locations",
        description: "LGBT+ status filter cleared",
      });
    } else {
      setLgbtFilter(value);
      
      let filterLabel = "";
      switch(value) {
        case "lgbt_owned":
          filterLabel = "LGBT+ Owned";
          break;
        case "lgbt_managed":
          filterLabel = "LGBT+ Managed";
          break;
        case "ally":
          filterLabel = "Allies";
          break;
      }
      
      toast({
        title: `Showing ${filterLabel}`,
        description: "Filter applied to map and listings",
      });
    }
  };

  // Get LGBT+ status badge
  const getLgbtStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    
    switch(status) {
      case 'lgbt_owned':
        return <Badge variant="lgbtOwned">LGBT+ Owned</Badge>;
      case 'lgbt_managed':
        return <Badge variant="lgbtManaged">LGBT+ Managed</Badge>;
      case 'ally':
        return <Badge variant="ally">Ally</Badge>;
      default:
        return null;
    }
  };

  // Filter businesses by category and LGBT+ status
  const filteredBusinesses = businesses.filter(business => {
    // Category filter
    const matchesCategory = selectedCategory 
      ? (business.category.toLowerCase() === selectedCategory.toLowerCase() || 
         business.tags.some(tag => tag?.toLowerCase() === selectedCategory.toLowerCase()))
      : true;
    
    // LGBT+ status filter
    const matchesLgbtStatus = lgbtFilter 
      ? business.lgbt_status === lgbtFilter
      : true;
    
    return matchesCategory && matchesLgbtStatus;
  });
  
  // Get appropriate icon for each category
  const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'cafés':
      case 'cafes':
        return <Coffee className="h-5 w-5" />;
      case 'nightlife':
        return <Music className="h-5 w-5" />;
      case 'healthcare':
        return <Stethoscope className="h-5 w-5" />;
      case 'retail':
        return <ShoppingBag className="h-5 w-5" />;
      case 'services':
        return <Settings className="h-5 w-5" />;
      case 'community':
        return <Users className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="pb-4">
      <div className="absolute top-0 left-0 right-0 h-40 z-0 bg-gradient-to-r from-rainbow-orange via-rainbow-yellow to-rainbow-green"></div>
      
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h1 className="text-2xl font-bold text-white">Discover</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="rounded-full flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {lgbtFilter ? (
                <>
                  {lgbtFilter === "lgbt_owned" && "LGBT+ Owned"}
                  {lgbtFilter === "lgbt_managed" && "LGBT+ Managed"}
                  {lgbtFilter === "ally" && "Allies"}
                </>
              ) : (
                "All"
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuRadioGroup value={lgbtFilter || "all"} onValueChange={handleLgbtFilterChange}>
              <DropdownMenuRadioItem value="all">All Locations</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="lgbt_owned">LGBT+ Owned</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="lgbt_managed">LGBT+ Managed</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="ally">Allies</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <InteractiveMap 
        className="h-64 mb-6 relative z-10" 
        defaultLocation={DEFAULT_LOCATION} 
        categoryFilter={selectedCategory}
        lgbtStatusFilter={lgbtFilter}
        onLocationSelect={handleOpenLocationDetails}
      />
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Featured Locations</h2>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>
        
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex gap-3">
            {filteredBusinesses.length > 0 ? (
              filteredBusinesses.map(business => (
                <Card 
                  key={business.id} 
                  className="min-w-[250px] max-w-[250px] card-hover cursor-pointer"
                  onClick={() => handleOpenLocationDetails(business)}
                >
                  <div 
                    className="h-32 bg-muted bg-cover bg-center relative"
                    style={{ backgroundImage: business.imageUrl ? `url(${business.imageUrl})` : undefined }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-2 right-2 flex gap-1 flex-col items-end">
                      <Badge variant="outline" className="bg-white/90 text-black border-none">
                        {business.category}
                      </Badge>
                      {business.lgbt_status && getLgbtStatusBadge(business.lgbt_status)}
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <h3 className="text-white font-semibold">{business.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="truncate">{business.location.address}, {business.location.city}</span>
                    </div>
                    <div className="flex gap-1">
                      {business.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-4 text-center w-full">
                <p className="text-muted-foreground">No {selectedCategory} locations found.</p>
              </div>
            )}
            
            <div className="min-w-[250px] max-w-[250px] h-[180px] border border-dashed rounded-lg flex flex-col items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Suggest a Location</p>
              <Button variant="outline" size="sm" className="mt-2">Add Place</Button>
            </div>
          </div>
        </ScrollArea>
      </div>
      
      <Tabs defaultValue="categories" className="relative z-10">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="categories" className="flex-1">Categories</TabsTrigger>
          <TabsTrigger value="trending" className="flex-1">Trending</TabsTrigger>
          <TabsTrigger value="nearby" className="flex-1">Nearby</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="mt-0">
          <Card 
            className={`card-hover cursor-pointer mb-3 ${selectedCategory === null ? 'ring-2 ring-primary' : ''}`}
            onClick={handleViewAll}
          >
            <CardContent className="p-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-rainbow-gradient flex items-center justify-center text-white">
                <Grid className="h-5 w-5" />
              </div>
              <span className="font-medium">View All Locations</span>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-3">
            {["Cafés", "Nightlife", "Healthcare", "Retail", "Services", "Community"].map(category => (
              <Card 
                key={category} 
                className={`card-hover cursor-pointer ${selectedCategory?.toLowerCase() === category.toLowerCase() ? 'ring-2 ring-primary' : ''}`}
                onClick={() => handleCategorySelect(category.toLowerCase())}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-rainbow-gradient flex items-center justify-center text-white">
                    {getCategoryIcon(category)}
                  </div>
                  <span className="font-medium">{category}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="trending" className="mt-0">
          <div className="space-y-3">
            {businesses.slice(0, 3).map(business => (
              <Card 
                key={business.id} 
                className="card-hover cursor-pointer"
                onClick={() => handleOpenLocationDetails(business)}
              >
                <CardContent className="p-3 flex gap-3">
                  <div 
                    className="h-16 w-16 bg-muted rounded-md bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: business.imageUrl ? `url(${business.imageUrl})` : undefined }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{business.name}</h3>
                      {business.lgbt_status && (
                        <Badge 
                          variant="outline" 
                          className={business.lgbt_status === 'ally' 
                            ? 'text-xs bg-primary/10 text-primary border-0' 
                            : 'text-xs bg-rainbow-gradient text-white border-0'
                          }
                        >
                          {business.lgbt_status === 'lgbt_owned' && 'LGBT+ Owned'}
                          {business.lgbt_status === 'lgbt_managed' && 'LGBT+ Managed'}
                          {business.lgbt_status === 'ally' && 'Ally'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{business.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{business.location.address}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="nearby" className="mt-0">
          <div className="space-y-3">
            {businesses.slice(3, 6).map(business => (
              <Card 
                key={business.id} 
                className="card-hover cursor-pointer"
                onClick={() => handleOpenLocationDetails(business)}
              >
                <CardContent className="p-3 flex gap-3">
                  <div 
                    className="h-16 w-16 bg-muted rounded-md bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: business.imageUrl ? `url(${business.imageUrl})` : undefined }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{business.name}</h3>
                      {business.lgbt_status && (
                        <Badge 
                          variant="outline" 
                          className={business.lgbt_status === 'ally' 
                            ? 'text-xs bg-primary/10 text-primary border-0' 
                            : 'text-xs bg-rainbow-gradient text-white border-0'
                          }
                        >
                          {business.lgbt_status === 'lgbt_owned' && 'LGBT+ Owned'}
                          {business.lgbt_status === 'lgbt_managed' && 'LGBT+ Managed'}
                          {business.lgbt_status === 'ally' && 'Ally'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{business.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{business.location.address}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <LocationDetailsDialog
        location={selectedLocation}
        isOpen={showLocationDetails}
        onClose={() => setShowLocationDetails(false)}
      />
    </div>
  );
}
