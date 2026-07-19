import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Locate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { MapLoadingState } from "./MapLoadingState";
import { MapZoomControls } from "./MapZoomControls";
import { MapMarkers } from "./MapMarkers";
import { MapLegend } from "./MapLegend";
import { useLocations } from "./useLocations";
import {
  DEFAULT_LOCATION,
  GOOGLE_MAPS_API_KEY,
  LOADER_ID,
  libraries,
  mapOptions,
  containerStyle
} from "./mapUtils";

// All filtering (search, category, verified) is driven by the parent page —
// the map itself only carries map-specific controls (zoom, locate, legend),
// so the page shows ONE set of filters and the map starts above the fold.
type MapProps = {
  className?: string;
  defaultLocation?: { lat: number; lng: number };
  searchText?: string;
  categoryFilter?: string | null;
  lgbtStatusFilter?: string | null;
  verifiedOnly?: boolean;
  onLocationSelect?: (location: any) => void;
};

export function InteractiveMap({
  className,
  defaultLocation = DEFAULT_LOCATION,
  searchText = "",
  categoryFilter = null,
  lgbtStatusFilter = null,
  verifiedOnly = false,
  onLocationSelect
}: MapProps) {
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [zoom, setZoom] = useState(12);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const navigate = useNavigate();
  const [mapCenter, setMapCenter] = useState(defaultLocation);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Re-centre when the parent changes the target location (city switcher)
  useEffect(() => {
    setMapCenter(defaultLocation);
    setZoom(12);
  }, [defaultLocation.lat, defaultLocation.lng]);

  const { filteredPlaces, isLoading, error } = useLocations({
    searchText,
    categoryFilter,
    lgbtStatusFilter,
    verifiedOnly,
  });

  const apiKey = GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
    id: LOADER_ID
  });

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

  const openLocationDetails = (place: any) => {
    if (onLocationSelect) {
      onLocationSelect(place);
    }
    // AllTrails pattern: pin tap shows the quick card, "View Details"
    // opens the full place page.
    navigate(`/place/${place.id}`);
  };

  const handleZoom = (zoomIn: boolean) => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom() || zoom;
      const newZoom = zoomIn ? currentZoom + 1 : currentZoom - 1;
      mapRef.current.setZoom(newZoom);
      setZoom(newZoom);
    }
  };

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

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setMapLoaded(true);
  };

  return (
    <div className={`rounded-lg overflow-hidden flex flex-col ${className}`}>
      <div className="relative flex-1 min-h-[300px]">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={zoom}
            options={mapOptions}
            onLoad={onMapLoad}
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

        {isLoaded && mapLoaded && (
          <>
            <MapZoomControls
              onZoomIn={() => handleZoom(true)}
              onZoomOut={() => handleZoom(false)}
            />
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-24 right-4 h-8 w-8 p-0 rounded-full bg-white shadow-md z-[1000]"
              onClick={getUserLocation}
              disabled={isLocating}
              aria-label="Centre map on my location"
            >
              <Locate className={`h-4 w-4 ${isLocating ? "animate-spin" : ""}`} aria-hidden="true" />
            </Button>
            <MapLegend />
          </>
        )}
      </div>
    </div>
  );
}
