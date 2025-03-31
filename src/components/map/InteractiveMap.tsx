
import { useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { toast } from "@/components/ui/use-toast";
import { LocationDetailsDialog } from "./LocationDetailsDialog";
import { MapSearchBar } from "./MapSearchBar";
import { MapLoadingState } from "./MapLoadingState";
import { MapZoomControls } from "./MapZoomControls";
import { MapMarkers } from "./MapMarkers";
import { useLocations } from "./useLocations";
import {
  DEFAULT_LOCATION,
  GOOGLE_MAPS_API_KEY,
  libraries,
  mapOptions,
  containerStyle
} from "./mapUtils";

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
  
  // Fetch and filter locations
  const { filteredPlaces } = useLocations(filter, categoryFilter, lgbtStatusFilter);
  
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
      <MapSearchBar 
        filter={filter}
        onFilterChange={setFilter}
        onLocateMe={getUserLocation}
        isLocating={isLocating}
      />
      
      <div className="relative flex-1 min-h-[300px]">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={userLocation || mapCenter}
            zoom={zoom}
            options={mapOptions}
            onLoad={onMapLoad}
            onCenterChanged={onCenterChanged}
          >
            {mapLoaded && (
              <MapMarkers 
                places={filteredPlaces}
                userLocation={userLocation}
                selectedPlace={selectedPlace}
                onMarkerClick={handleMarkerClick}
                onInfoWindowClose={() => setSelectedPlace(null)}
                onViewDetails={openLocationDetails}
              />
            )}
          </GoogleMap>
        ) : (
          <MapLoadingState error={mapError} />
        )}
        
        {/* Custom zoom controls */}
        {isLoaded && mapLoaded && (
          <MapZoomControls 
            onZoomIn={() => handleZoom(true)}
            onZoomOut={() => handleZoom(false)}
          />
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
