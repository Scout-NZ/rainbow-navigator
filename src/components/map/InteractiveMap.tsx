import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { toast } from "@/components/ui/use-toast";
import { MapSearchBar } from "./MapSearchBar";
import { MapLoadingState } from "./MapLoadingState";
import { MapZoomControls } from "./MapZoomControls";
import { MapMarkers } from "./MapMarkers";
import { MapLegend } from "./MapLegend";
import { FilterPanel } from "./FilterPanel";
import { useLocations } from "./useLocations";
import {
  DEFAULT_LOCATION,
  GOOGLE_MAPS_API_KEY,
  LOADER_ID,
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
  categoryFilter: initialCategoryFilter,
  lgbtStatusFilter: initialLgbtStatusFilter,
  onLocationSelect 
}: MapProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [zoom, setZoom] = useState(12);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const navigate = useNavigate();
  const [mapCenter, setMapCenter] = useState(defaultLocation);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  // Advanced filter states
  const [categoryFilter, setCategoryFilter] = useState<string | null>(initialCategoryFilter || null);
  const [lgbtStatusFilter, setLgbtStatusFilter] = useState<string | null>(initialLgbtStatusFilter || null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Keep internal filter state in sync when the parent changes the props
  // (e.g. the category chips on the Discover page)
  useEffect(() => {
    setCategoryFilter(initialCategoryFilter || null);
  }, [initialCategoryFilter]);

  // Re-centre when the parent changes the target location (city switcher)
  useEffect(() => {
    setMapCenter(defaultLocation);
    setZoom(12);
  }, [defaultLocation.lat, defaultLocation.lng]);

  useEffect(() => {
    setLgbtStatusFilter(initialLgbtStatusFilter || null);
  }, [initialLgbtStatusFilter]);
  
  const { filteredPlaces, isLoading, error } = useLocations({
    searchText,
    categoryFilter,
    lgbtStatusFilter,
    verifiedOnly,
  });
  
  const apiKey = GOOGLE_MAPS_API_KEY;
  
  // Using the consistent loader ID from mapUtils
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
    id: LOADER_ID
  });
  
  useEffect(() => {
    console.log("Google Maps API Key being used:", apiKey);
    console.log("Filtered places:", filteredPlaces?.length || 0);
    
    if (loadError) {
      console.error("Error loading Google Maps:", loadError);
      setMapError("Failed to load Google Maps. Please check your connection and try again.");
      toast({
        title: "Map Error",
        description: "Failed to load Google Maps. Please check your connection and try again.",
        variant: "destructive"
      });
    }
  }, [loadError, apiKey, filteredPlaces]);

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
    console.log("Google Map loaded successfully");
    mapRef.current = map;
    setMapLoaded(true);
  };

  // Calculate active filters count for badge
  const getActiveFiltersCount = () => {
    let count = 0;
    if (categoryFilter) count++;
    if (lgbtStatusFilter) count++;
    if (verifiedOnly) count++;
    return count;
  };

  return (
    <div className={`rounded-lg overflow-hidden flex flex-col ${className}`}>
      <MapSearchBar 
        filter={searchText}
        onFilterChange={setSearchText}
        onLocateMe={getUserLocation}
        isLocating={isLocating}
        onOpenFilters={() => setShowFilterPanel(true)}
        activeFiltersCount={getActiveFiltersCount()}
      />
      
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
            <MapLegend />
          </>
        )}
        
        {showFilterPanel && (
          <div className="absolute top-2 right-2 left-2 z-10 flex justify-center">
            <FilterPanel 
              onClose={() => setShowFilterPanel(false)}
              selectedCategory={categoryFilter}
              onCategoryChange={setCategoryFilter}
              selectedLgbtStatus={lgbtStatusFilter}
              onLgbtStatusChange={setLgbtStatusFilter}
              verifiedOnly={verifiedOnly}
              onVerifiedChange={setVerifiedOnly}
            />
          </div>
        )}
      </div>

    </div>
  );
}
