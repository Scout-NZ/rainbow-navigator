
import { useEffect, useRef, useState } from "react";
import { MapPin, Search, Locate } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockPlaces } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";
import { LocationDetailsDialog } from "./LocationDetailsDialog";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LatLngExpression } from 'leaflet';

// Fix Leaflet marker icon issue
// This is needed because Leaflet expects the marker icons to be in a specific location
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Default map container style
const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

// Default location (Auckland, New Zealand)
const DEFAULT_LOCATION = { lat: -36.8485, lng: 174.7633 };

// Custom marker icons based on place type
const getMarkerIcon = (type: string) => {
  return L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    className: `marker-${type.toLowerCase()}`
  });
};

// MapController component to control the map view when props change
function MapController({ center, zoom }: { center: { lat: number; lng: number }, zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom);
  }, [center, zoom, map]);
  
  return null;
}

type MapProps = {
  className?: string;
  defaultLocation?: { lat: number; lng: number };
  categoryFilter?: string | null;
  onLocationSelect?: (location: typeof mockPlaces[0]) => void;
};

export function InteractiveMap({ 
  className, 
  defaultLocation = DEFAULT_LOCATION, 
  categoryFilter,
  onLocationSelect 
}: MapProps) {
  const [filter, setFilter] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<typeof mockPlaces[0] | null>(null);
  const [zoom, setZoom] = useState(12);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultLocation);
  const mapRef = useRef<L.Map | null>(null);
  
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

  // Function to open location details dialog
  const openLocationDetails = (place: typeof mockPlaces[0]) => {
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
      const currentZoom = mapRef.current.getZoom();
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

  // Convert location objects to LatLngExpression for Leaflet
  const mapCenterPosition: LatLngExpression = [mapCenter.lat, mapCenter.lng];
  const userLocationPosition: LatLngExpression | undefined = userLocation ? [userLocation.lat, userLocation.lng] : undefined;

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
        {/* Leaflet Map component */}
        <MapContainer
          style={containerStyle}
          center={mapCenterPosition}
          zoom={zoom}
          ref={(map) => {
            if (map) mapRef.current = map;
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Controller to update map view when props change */}
          <MapController 
            center={userLocation || mapCenter} 
            zoom={zoom} 
          />
          
          {/* User location marker */}
          {userLocation && userLocationPosition && (
            <Marker
              position={userLocationPosition}
              icon={L.divIcon({
                className: 'user-location-marker',
                html: '<div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>',
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              })}
            />
          )}
          
          {/* Render markers for each place */}
          {filteredPlaces.map((place) => {
            const position: LatLngExpression = [place.location.lat, place.location.lng];
            return (
              <Marker
                key={place.id}
                position={position}
                icon={getMarkerIcon(place.type)}
                eventHandlers={{
                  click: () => handleMarkerClick(place),
                }}
              >
                <Popup>
                  <div className="p-2 max-w-[200px]">
                    <h3 className="font-semibold text-sm">{place.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{place.category}</p>
                    <p className="text-xs mt-1">{place.location.address}, {place.location.city}</p>
                    <Button 
                      size="sm" 
                      variant="link" 
                      className="text-xs p-0 h-auto mt-1" 
                      onClick={() => openLocationDetails(place)}
                    >
                      View Details
                    </Button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
        
        {/* Custom zoom controls */}
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
      </div>

      {/* Location Details Dialog */}
      <LocationDetailsDialog 
        location={selectedPlace} 
        isOpen={showDetailsDialog} 
        onClose={() => setShowDetailsDialog(false)}
      />
      
      {/* Add CSS for custom markers */}
      <style dangerouslySetInnerHTML={{ __html: `
        .marker-business {
          filter: hue-rotate(30deg);
        }
        .marker-event {
          filter: hue-rotate(240deg);
        }
        .marker-resource {
          filter: hue-rotate(120deg);
        }
        .user-location-marker {
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
        }
      `}} />
    </div>
  );
}
