
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { mockPlaces } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";
import { transformLocation } from './mapUtils';

export function useLocations(
  filter: string = "",
  categoryFilter: string | null = null,
  lgbtStatusFilter: string | null = null
) {
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

  return { filteredPlaces, isLoading, error };
}
