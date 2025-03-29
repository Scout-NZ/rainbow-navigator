import { useState } from "react";
import { MapPin, Plus, Coffee, Music, Heart, ShoppingBag, Settings, Users, Grid, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { InteractiveMap } from "@/components/map/InteractiveMap";

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
  const [mapView, setMapView] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchRadius, setSearchRadius] = useState([5]);
  const [lgbtStatus, setLgbtStatus] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="space-y-6">
      {/* Main tabs for Map and List views */}
      <Tabs 
        defaultValue="map" 
        className="w-full"
        onValueChange={(value) => setMapView(value === "map")}
      >
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
          >
            <MapPin className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Current Location</span>
          </Button>
        </div>

        {/* Search and filter section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input 
            type="search" 
            placeholder="Search places..." 
            className="md:col-span-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
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
        
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Customize your search</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="radius">Search Radius (km)</Label>
              <Slider
                id="radius"
                defaultValue={searchRadius}
                max={50}
                step={1}
                onValueChange={setSearchRadius}
              />
              <p className="text-sm text-muted-foreground">
                Current radius: {searchRadius[0]} km
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="lgbt-friendly">LGBT Friendly Only</Label>
              <Switch 
                id="lgbt-friendly"
                checked={lgbtStatus}
                onCheckedChange={setLgbtStatus}
              />
            </div>
          </CardContent>
        </Card>

        {/* Map View Tab Content */}
        <TabsContent value="map" className="mt-0">
          <InteractiveMap />
        </TabsContent>
        
        {/* List View Tab Content */}
        <TabsContent value="list" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={`https://picsum.photos/50/50?random=${i}`} alt="Avatar" />
                      <AvatarFallback>AV</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">Place Name {i}</h4>
                      <p className="text-xs text-muted-foreground">Category: Cafe</p>
                    </div>
                  </div>
                  <p className="text-sm mt-2 text-muted-foreground">
                    A brief description about the place and what makes it special.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center p-4">
                  <Badge variant="secondary">LGBTQ+ Friendly</Badge>
                  <Button variant="link" size="sm">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
