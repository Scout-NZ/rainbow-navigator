import { useEffect, useRef, useState } from "react";
import { MapPin, Search, Locate, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockPlaces } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";
import { LocationDetailsDialog } from "./LocationDetailsDialog";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

// Default map container style
const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

// City coordinates for New Zealand locations
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Auckland': { lat: -36.8485, lng: 174.7633 },
  'Wellington': { lat: -41.2865, lng: 174.7762 },
  'Christchurch': { lat: -43.5320, lng: 172.6306 },
  'Hamilton': { lat: -37.7870, lng: 175.2793 },
  'Tauranga': { lat: -37.6878, lng: 176.1651 },
  'Dunedin': { lat: -45.8788, lng: 170.5028 },
  'Waikato': { lat: -37.7870, lng: 175.2793 },
  'Wairarapa': { lat: -41.0000, lng: 175.6500 },
  'Kapiti': { lat: -40.9000, lng: 175.0000 },
  'National': { lat: -41.0000, lng: 174.0000 }, // Center of NZ
  'Taupō': { lat: -38.6857, lng: 176.0702 }
};

// Default location (Auckland, New Zealand)
const DEFAULT_LOCATION = { lat: -36.8485, lng: 174.7633 };

// Get coordinates for a given city
const getCityCoordinates = (city: string | null): { lat: number; lng: number } => {
  if (!city) return DEFAULT_LOCATION;
  
  // Try to find exact match
  if (CITY_COORDINATES[city]) {
    return CITY_COORDINATES[city];
  }
  
  // Try case-insensitive match
  const normalizedCity = city.toLowerCase();
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (key.toLowerCase() === normalizedCity) {
      return coords;
    }
  }
  
  // If no match found, return default
  console.log(`No coordinates found for city: ${city}, using default`);
  return DEFAULT_LOCATION;
};

// Transform Supabase location to app location format
const transformLocation = (location: any) => {
  // Ensure that type and category are included in tags
  let tags = location.tags || [];
  
  // Add type and category to tags if they don't already exist
  if (location.type && !tags.includes(location.type.toLowerCase())) {
    tags.push(location.type.toLowerCase());
  }
  
  if (location.category && !tags.includes(location.category.toLowerCase())) {
    tags.push(location.category.toLowerCase());
  }
  
  // Get coordinates based on the location's city or use the provided lat/lng
  const coordinates = location.lat && location.lng 
    ? { lat: location.lat, lng: location.lng }
    : getCityCoordinates(location.city);
  
  return {
    id: location.id,
    name: location.name,
    type: location.type || 'business',
    category: location.category,
    tags: tags,
    description: location.description || '',
    location: {
      address: location.address || '',
      neighbourhood: location.neighbourhood || '',
      city: location.city || '',
      lat: coordinates.lat,
      lng: coordinates.lng
    },
    contact: {
      phone: location.phone || '',
      email: location.email || '',
      website: location.website || ''
    },
    imageUrl: location.image_url || '',
    verified: location.verified || false,
    lgbt_status: location.lgbt_status || null
  };
};

// Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyDQlnjBL6hINz0TKvDNbS5rQwSU-BH0inE';

// Libraries to load with Google Maps
const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

// Map options for Google Maps
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
};

// Custom marker icons based on place type
const getMarkerIcon = (type: string, lgbtStatus: string | null) => {
  // Set base color based on type
  let fillColor = '#4B5563'; // default gray
  
  if (type.toLowerCase() === 'business') {
    fillColor = '#F59E0B'; // amber
  } else if (type.toLowerCase() === 'event') {
    fillColor = '#8B5CF6'; // purple
  } else if (type.toLowerCase() === 'resource') {
    fillColor = '#10B981'; // emerald
  }
  
  // Modify color for LGBT status
  if (lgbtStatus === 'lgbt_owned' || lgbtStatus === 'lgbt_managed') {
    fillColor = '#EC4899'; // pink
  } else if (lgbtStatus === 'ally') {
    fillColor = '#3B82F6'; // blue
  }
  
  // For Google Maps we use SVG path with proper Point object for anchor
  return {
    path: 'M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z',
    fillColor: fillColor,
    fillOpacity: 0.9,
    strokeWeight: 1,
    strokeColor: '#FFFFFF',
    scale: 1.5,
    anchor: new google.maps.Point(12, 24),
  };
};

type MapProps = {
  className?: string;
  defaultLocation?: { lat: number; lng: number };
  categoryFilter?: string | null;
  lgbtStatusFilter?: string | null;
  onLocationSelect?: (location: any) => void;
};

export function InteractiveMap({ 
  className, 
  defaultLocation = DEFAULT_LOCATION, 
  categoryFilter,
  lgbtStatusFilter,
  onLocationSelect 
}: MapProps) {
  const [filter, setFilter] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [zoom, setZoom] = useState(12);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultLocation);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Load Google Maps API with error handling
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries
  });
  
  // Handle Google Maps loading error
  useEffect(() => {
    if (loadError) {
      console.error("Error loading Google Maps:", loadError);
      setMapError("Failed to load Google Maps. Please check your connection and try again.");
      toast({
        title: "Map Error",
        description: "Failed to load Google Maps. Please check your connection and try again.",
        variant: "destructive"
      });
    }
  }, [loadError]);
  
  // Fetch locations from Supabase
  const { data: locations = [], isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*');
        
        if (error) {
          console.error('Error fetching locations:', error);
          throw error;
        }
        
        return data.map(transformLocation);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        toast({
          title: "Error",
          description: "Failed to load location data. Using mock data instead.",
          variant: "destructive"
        });
        return [];
      }
    }
  });
  
  console.log("All locations with coordinates:", locations);
  console.log("Category filter:", categoryFilter);
  console.log("LGBT+ status filter:", lgbtStatusFilter);
  
  // Use mockPlaces as fallback while loading or if there's an error
  const places = locations.length > 0 ? locations : mockPlaces;
  
  // Filter places based on search text, category filter, and LGBT+ status filter
  const filteredPlaces = places.filter(place => {
    // Apply search text filter
    const matchesSearch = 
      place.name.toLowerCase().includes(filter.toLowerCase()) || 
      (place.category && place.category.toLowerCase().includes(filter.toLowerCase())) || 
      (place.tags && place.tags.some((tag: string) => tag?.toLowerCase().includes(filter.toLowerCase())));
    
    // Apply category filter if it exists - check in both the category field and tags
    let matchesCategory = true;
    if (categoryFilter) {
      const normalizedCategory = categoryFilter.toLowerCase();
      matchesCategory = 
        (place.category && place.category.toLowerCase() === normalizedCategory) ||
        (place.tags && place.tags.some((tag: string) => tag?.toLowerCase() === normalizedCategory));
      
      // Special case for "healthcare" category since it might be capitalized differently
      if (normalizedCategory === "healthcare") {
        matchesCategory = 
          (place.category && place.category.toLowerCase() === "healthcare") ||
          (place.tags && place.tags.some((tag: string) => 
            tag?.toLowerCase() === "healthcare" || tag?.toLowerCase() === "health" || tag?.toLowerCase() === "medical"
          ));
      }
    }
    
    // Apply LGBT+ status filter if it exists
    let matchesLgbtStatus = true;
    if (lgbtStatusFilter) {
      // When filtering for LGBT status, if the item doesn't have any status, include it in results
      // This ensures we show places without a specified LGBT status when filtering
      matchesLgbtStatus = !place.lgbt_status || place.lgbt_status === lgbtStatusFilter;
    }
    
    return matchesSearch && matchesCategory && matchesLgbtStatus;
  });

  console.log("Filtered places:", filteredPlaces);

  const handleMarkerClick = (place: any) => {
    setSelectedPlace(place);
  };

  // Function to open location details dialog
  const openLocationDetails = (place: any) => {
    setSelectedPlace(place);
    setShowDetailsDialog(true);
    
    // If a parent component wants to handle the selection, call the callback
    if (onLocationSelect) {
      onLocationSelect(place);
    }
  };

  // Function to handle map zoom
  const handleZoom = (zoomIn: boolean) => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom() || zoom;
      const newZoom = zoomIn ? currentZoom + 1 : currentZoom - 1;
      mapRef.current.setZoom(newZoom);
      setZoom(newZoom);
    }
  };

  // Function to get user's location
  const getUserLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          setMapCenter(userPos);
          setZoom(14);
          
          // If map is loaded, pan to user location
          if (mapRef.current) {
            mapRef.current.panTo(userPos);
            mapRef.current.setZoom(14);
          }
          
          toast({
            title: "Location found",
            description: "Map centered on your current location",
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location: ", error);
          toast({
            title: "Location error",
            description: "Could not get your location. Please check permissions.",
            variant: "destructive"
          });
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
      setIsLocating(false);
    }
  };

  // Set map and save ref when loaded
  const onMapLoad = (map: google.maps.Map) => {
    console.log("Google Map loaded successfully");
    mapRef.current = map;
    setMapLoaded(true);
  };

  // Handle map load error
  const onMapLoadError = (error: Error) => {
    console.error("Error loading map:", error);
    setMapError(`Failed to initialize map: ${error.message}`);
    toast({
      title: "Map Error",
      description: `Failed to initialize map: ${error.message}`,
      variant: "destructive"
    });
  };

  // Handle map center changed
  const onCenterChanged = () => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter();
      if (newCenter) {
        setMapCenter({
          lat: newCenter.lat(),
          lng: newCenter.lng()
        });
      }
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
        <Button 
          size="sm" 
          variant="outline" 
          className="rounded-full flex items-center gap-1"
          onClick={getUserLocation}
          disabled={isLocating}
        >
          <Locate className="h-4 w-4" />
          {isLocating ? "Locating..." : "Near Me"}
        </Button>
      </div>
      
      <div className="relative flex-1 min-h-[300px]">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={userLocation || mapCenter}
            zoom={zoom}
            options={mapOptions}
            onLoad={onMapLoad}
            onCenterChanged={onCenterChanged}
            onError={onMapLoadError}
          >
            {mapLoaded && (
              <>
                {/* User location marker */}
                {userLocation && (
                  <MarkerF
                    position={userLocation}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 8,
                      fillColor: "#3B82F6",
                      fillOpacity: 1,
                      strokeColor: "#FFFFFF",
                      strokeWeight: 2,
                    }}
                  />
                )}
                
                {/* Place markers */}
                {filteredPlaces.map((place) => (
                  <MarkerF
                    key={place.id}
                    position={{
                      lat: place.location.lat,
                      lng: place.location.lng
                    }}
                    icon={getMarkerIcon(place.type, place.lgbt_status)}
                    onClick={() => handleMarkerClick(place)}
                  />
                ))}
                
                {/* Info window for selected place */}
                {selectedPlace && (
                  <InfoWindowF
                    position={{
                      lat: selectedPlace.location.lat,
                      lng: selectedPlace.location.lng
                    }}
                    onCloseClick={() => setSelectedPlace(null)}
                  >
                    <div className="p-2 max-w-[200px]">
                      <h3 className="font-semibold text-sm">{selectedPlace.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{selectedPlace.category}</p>
                      <p className="text-xs mt-1">
                        {selectedPlace.location.address}, {selectedPlace.location.city}
                      </p>
                      {selectedPlace.lgbt_status && (
                        <p className="text-xs mt-1 font-medium">
                          {selectedPlace.lgbt_status === 'lgbt_owned' && '🏳️‍🌈 LGBT+ Owned'}
                          {selectedPlace.lgbt_status === 'lgbt_managed' && '🏳️‍🌈 LGBT+ Managed'}
                          {selectedPlace.lgbt_status === 'ally' && '❤️ Ally'}
                        </p>
                      )}
                      <Button 
                        size="sm" 
                        variant="link" 
                        className="text-xs p-0 h-auto mt-1" 
                        onClick={() => openLocationDetails(selectedPlace)}
                      >
                        View Details
                      </Button>
                    </div>
                  </InfoWindowF>
                )}
              </>
            )}
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-full bg-muted">
            {mapError ? (
              <div className="text-center p-4">
                <div className="mb-2 h-12 w-12 text-red-500 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-500">Map Error</h3>
                <p className="text-sm text-muted-foreground">{mapError}</p>
                <p className="text-xs mt-2">Please check the console for more details</p>
              </div>
            ) : (
              <>
                <div className="animate-spin mr-2 h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                <span>Loading map...</span>
              </>
            )}
          </div>
        )}
        
        {/* Custom zoom controls */}
        {isLoaded && mapLoaded && (
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
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
        )}
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
