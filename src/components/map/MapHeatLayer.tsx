import { useEffect, useRef } from "react";
import { useGoogleMap } from "@react-google-maps/api";

// Community-activity heat layer. Points are PLACES (not people): each place
// glows by its aggregate activity score (check-ins, ratings, saves) from the
// public place_activity view — no individual movement data exists anywhere.
export function MapHeatLayer({ places, scores, visible }: {
  places: { location: { lat: number; lng: number }; id: string | number }[];
  scores: Record<string, number>;
  visible: boolean;
}) {
  const map = useGoogleMap();
  const layerRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);

  useEffect(() => {
    if (!map || !google.maps.visualization) return;
    if (!visible) {
      layerRef.current?.setMap(null);
      return;
    }
    const points = places
      .map((p) => {
        const weight = scores[String(p.id)] ?? 0;
        return weight > 0
          ? { location: new google.maps.LatLng(p.location.lat, p.location.lng), weight }
          : null;
      })
      .filter(Boolean) as google.maps.visualization.WeightedLocation[];

    if (!layerRef.current) {
      layerRef.current = new google.maps.visualization.HeatmapLayer({
        radius: 42,
        opacity: 0.65,
      });
    }
    layerRef.current.setData(points);
    layerRef.current.setMap(map);

    return () => { layerRef.current?.setMap(null); };
  }, [map, places, scores, visible]);

  return null;
}
