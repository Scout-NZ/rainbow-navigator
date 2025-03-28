
import { useEffect, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockPlaces } from "@/data/mockData";

type MapProps = {
  className?: string;
  defaultLocation?: { lat: number; lng: number };
};

export function InteractiveMap({ className, defaultLocation = { lat: 40.7128, lng: -74.0060 } }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // This is a placeholder for actual map implementation
    // In a real implementation, we would initialize a map library here
    if (mapRef.current) {
      // Simulate map loading
      const timer = setTimeout(() => {
        setMapLoaded(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const filteredPlaces = mockPlaces.filter(place => 
    place.name.toLowerCase().includes(filter.toLowerCase()) || 
    place.category.toLowerCase().includes(filter.toLowerCase()) || 
    place.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className={`rounded-lg overflow-hidden flex flex-col ${className}`}>
      <div className="p-3 bg-background border-b flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search"
            placeholder="Search places..."
            className="pl-9 pr-4"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <Button size="sm" variant="outline" className="rounded-full">
          Filter
        </Button>
      </div>
      
      <div className="relative flex-1 min-h-[300px]">
        {/* Map placeholder - in a real implementation, this would be a map library component */}
        <div 
          ref={mapRef} 
          className="absolute inset-0 bg-gray-100"
          style={{ 
            background: "url(https://images.unsplash.com/photo-1524661135-423995f22d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&h=800&q=80) no-repeat center center",
            backgroundSize: "cover"
          }}
        >
          {/* Overlay with opacity to make the map background less prominent */}
          <div className="absolute inset-0 bg-background/20"></div>
          
          {/* Map pins - in a real implementation, these would be placed based on coordinates */}
          {mapLoaded && filteredPlaces.map((place, index) => (
            <div 
              key={place.id}
              className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group"
              style={{ 
                left: `${30 + (index * 10)}%`, 
                top: `${30 + (index * 8)}%`,
                zIndex: 10
              }}
            >
              <div className="flex flex-col items-center">
                <div className={`
                  p-1 rounded-full 
                  ${place.type === 'business' ? 'bg-rainbow-blue' : 
                    place.type === 'event' ? 'bg-rainbow-violet' : 'bg-rainbow-green'}
                  text-white shadow-lg group-hover:scale-110 transition-transform
                `}>
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 bg-background/90 backdrop-blur-sm p-1.5 rounded text-xs font-medium shadow-lg whitespace-nowrap">
                  {place.name}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Loading indicator */}
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-rainbow-gradient"></div>
              <p className="mt-2 text-sm font-medium">Loading map...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
