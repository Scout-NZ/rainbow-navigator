
import React, { useEffect, useRef } from 'react';
import { MarkerF, InfoWindowF, MarkerClustererF } from '@react-google-maps/api';
import type { Clusterer } from '@react-google-maps/marker-clusterer';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const clustererRef = useRef<Clusterer | null>(null);

  // Several places share the exact same coordinates (same building, or a
  // city-centre fallback). Identical points can never be split apart by
  // zooming, so fan each stack out in a small circle (~20m) — far enough
  // to tap individually at street zoom, invisible at city zoom.
  const spreadPlaces = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of places) {
      const k = `${p.location.lat},${p.location.lng}`;
      counts[k] = (counts[k] || 0) + 1;
    }
    const used: Record<string, number> = {};
    return places.map((p) => {
      const k = `${p.location.lat},${p.location.lng}`;
      if (counts[k] <= 1) return { ...p, mapLat: p.location.lat, mapLng: p.location.lng };
      const i = used[k] = (used[k] ?? -1) + 1;
      const angle = (2 * Math.PI * i) / counts[k];
      const radius = 0.0002;
      return {
        ...p,
        mapLat: p.location.lat + radius * Math.cos(angle),
        mapLng: p.location.lng + radius * Math.sin(angle) * 1.4,
      };
    });
  }, [places]);

  // Markers are added/removed with noClustererRedraw so that tearing the map
  // down (switching to list view, navigating to a place page) never asks the
  // clusterer to recompute bounds on a detached map — that crashes inside the
  // library ("undefined is not an object (evaluating 'getNorthEast().lat')").
  // Instead we repaint once per places change while the map is alive.
  useEffect(() => {
    if (clustererRef.current) {
      clustererRef.current.repaint();
    }
  }, [places]);

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
      
      {/* Place markers, clustered so dense city centres stay readable */}
      {/* maxZoom: past street level, always show individual pins */}
      <MarkerClustererF options={{ maxZoom: 16 }}>
        {(clusterer) => {
          clustererRef.current = clusterer;
          return (
            <>
              {spreadPlaces.map((place) => (
                <MarkerF
                  key={place.id}
                  position={{ lat: place.mapLat, lng: place.mapLng }}
                  icon={getMarkerIcon(place.category, place.lgbt_status)}
                  onClick={() => onMarkerClick(place)}
                  clusterer={clusterer}
                  noClustererRedraw
                />
              ))}
            </>
          );
        }}
      </MarkerClustererF>
      
      {/* Info window for selected place */}
      {selectedPlace && (
        <InfoWindowF
          position={{
            lat: selectedPlace.location.lat,
            lng: selectedPlace.location.lng
          }}
          onCloseClick={onInfoWindowClose}
        >
          <div className="p-2 max-w-[250px]">
            <div className="flex items-start justify-between gap-1">
              <h3 className="font-semibold text-sm">{selectedPlace.name}</h3>
              {selectedPlace.verified && (
                <Badge className="ml-1 bg-green-100 text-green-800 text-xs border-green-300 whitespace-nowrap">
                  ✓ Verified
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant="outline" className="text-xs">
                {selectedPlace.category}
              </Badge>
              
              {selectedPlace.lgbt_status && (
                <Badge variant="outline" className="text-xs">
                  {selectedPlace.lgbt_status === 'lgbt_owned' && '🏳️‍🌈 LGBT+ Owned'}
                  {selectedPlace.lgbt_status === 'lgbt_managed' && '🏳️‍🌈 LGBT+ Managed'}
                  {selectedPlace.lgbt_status === 'ally' && '❤️ Ally'}
                </Badge>
              )}
            </div>
            
            <p className="text-xs mt-2">
              {selectedPlace.location.address}, {selectedPlace.location.city}
            </p>
            
            <Button 
              size="sm" 
              variant="link" 
              className="text-xs p-0 h-auto mt-2" 
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
