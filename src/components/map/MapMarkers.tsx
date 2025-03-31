
import React from 'react';
import { MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Button } from "@/components/ui/button";
import { getMarkerIcon } from './mapUtils';

type MapMarkersProps = {
  places: any[];
  userLocation: { lat: number; lng: number } | null;
  selectedPlace: any | null;
  onMarkerClick: (place: any) => void;
  onInfoWindowClose: () => void;
  onViewDetails: (place: any) => void;
};

export function MapMarkers({ 
  places, 
  userLocation, 
  selectedPlace, 
  onMarkerClick, 
  onInfoWindowClose,
  onViewDetails
}: MapMarkersProps) {
  // Early return if google isn't available
  if (typeof google === 'undefined') {
    console.warn('Google Maps API not loaded yet');
    return null;
  }

  return (
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
      {places.map((place) => (
        <MarkerF
          key={place.id}
          position={{
            lat: place.location.lat,
            lng: place.location.lng
          }}
          icon={getMarkerIcon(place.type, place.lgbt_status)}
          onClick={() => onMarkerClick(place)}
        />
      ))}
      
      {/* Info window for selected place */}
      {selectedPlace && (
        <InfoWindowF
          position={{
            lat: selectedPlace.location.lat,
            lng: selectedPlace.location.lng
          }}
          onCloseClick={onInfoWindowClose}
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
              onClick={() => onViewDetails(selectedPlace)}
            >
              View Details
            </Button>
          </div>
        </InfoWindowF>
      )}
    </>
  );
}
