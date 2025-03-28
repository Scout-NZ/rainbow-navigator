
import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockPlaces } from "@/data/mockData";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { toast } from "@/components/ui/use-toast";

// Default map container style
const containerStyle = {
  width: '100%',
  height: '100%'
};

// Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyDK3hZtsdLtb8zsTT5mzzdDCC8Nj5O2wyQ";

type MapProps = {
  className?: string;
  defaultLocation?: { lat: number; lng: number };
  categoryFilter?: string | null;
};

export function InteractiveMap({ className, defaultLocation = { lat: 40.7128, lng: -74.0060 }, categoryFilter }: MapProps) {
  const [filter, setFilter] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<typeof mockPlaces[0] | null>(null);
  const [zoom, setZoom] = useState(12);
  
  // Load the Google Maps JavaScript API with the API key
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    id: 'google-map-script'
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMapLoaded(true);
    
    // Set up zoom changed listener
    map.addListener('zoom_changed', () => {
      if (map.getZoom()) {
        setZoom(map.getZoom()!);
      }
    });
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // Filter places based on search text AND category filter if provided
  const filteredPlaces = mockPlaces.filter(place => {
    // Apply search text filter
    const matchesSearch = 
      place.name.toLowerCase().includes(filter.toLowerCase()) || 
      place.category.toLowerCase().includes(filter.toLowerCase()) || 
      place.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()));
    
    // Apply category filter if it exists
    const matchesCategory = categoryFilter 
      ? place.category.toLowerCase() === categoryFilter.toLowerCase() ||
        place.tags.some(tag => tag.toLowerCase() === categoryFilter.toLowerCase())
      : true;
    
    return matchesSearch && matchesCategory;
  });

  const handleMarkerClick = (place: typeof mockPlaces[0]) => {
    setSelectedPlace(place);
  };

  const handleCloseInfoWindow = () => {
    setSelectedPlace(null);
  };

  // Function to handle map zoom
  const handleZoom = (zoomIn: boolean) => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom() || zoom;
      const newZoom = zoomIn ? currentZoom + 1 : currentZoom - 1;
      mapRef.current.setZoom(newZoom);
    }
  };

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
        {/* Google Maps component */}
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultLocation}
            zoom={zoom}
            onLoad={onMapLoad}
            onUnmount={onUnmount}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true,
            }}
          >
            {/* Render markers for each place */}
            {mapLoaded && filteredPlaces.map((place) => (
              <Marker
                key={place.id}
                position={{
                  lat: place.location.lat || defaultLocation.lat,
                  lng: place.location.lng || defaultLocation.lng
                }}
                onClick={() => handleMarkerClick(place)}
                icon={{
                  path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                  fillColor: place.type === 'business' ? '#3b82f6' : place.type === 'event' ? '#8b5cf6' : '#10b981',
                  fillOpacity: 1,
                  strokeWeight: 0,
                  rotation: 0,
                  scale: 2,
                  anchor: new google.maps.Point(12, 24),
                }}
              />
            ))}

            {/* Info window for selected place */}
            {selectedPlace && (
              <InfoWindow
                position={{
                  lat: selectedPlace.location.lat || defaultLocation.lat,
                  lng: selectedPlace.location.lng || defaultLocation.lng
                }}
                onCloseClick={handleCloseInfoWindow}
              >
                <div className="p-2 max-w-[200px]">
                  <h3 className="font-semibold text-sm">{selectedPlace.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{selectedPlace.category}</p>
                  <p className="text-xs mt-1">{selectedPlace.location.address}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-rainbow-gradient"></div>
              <p className="mt-2 text-sm font-medium">
                {loadError ? "Error loading Google Maps" : "Loading map..."}
              </p>
            </div>
          </div>
        )}
        
        {/* Custom zoom controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-8 w-8 p-0 rounded-full bg-white shadow-md"
            onClick={() => handleZoom(true)}
          >
            +
          </Button>
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-8 w-8 p-0 rounded-full bg-white shadow-md"
            onClick={() => handleZoom(false)}
          >
            -
          </Button>
        </div>
      </div>
    </div>
  );
}
