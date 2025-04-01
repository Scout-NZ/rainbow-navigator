
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { mockPlaces } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";
import { transformLocation } from './mapUtils';

type LocationFilters = {
  searchText?: string;
  categoryFilter?: string | null;
  lgbtStatusFilter?: string | null;
  verifiedOnly?: boolean;
};

export function useLocations({
  searchText = "",
  categoryFilter = null,
  lgbtStatusFilter = null,
  verifiedOnly = false,
}: LocationFilters) {
  // Fetch locations from Supabase
  const { data: locations = [], isLoading, error } = useQuery({
    queryKey: ['locations', categoryFilter, lgbtStatusFilter, verifiedOnly],
    queryFn: async () => {
      try {
        let query = supabase
          .from('locations')
          .select('*');
        
        // Add filters to the query if they exist
        if (categoryFilter) {
          query = query.eq('category', categoryFilter);
        }
        
        if (lgbtStatusFilter) {
          query = query.eq('lgbt_status', lgbtStatusFilter);
        }
        
        if (verifiedOnly) {
          query = query.eq('verified', true);
        }
        
        const { data, error } = await query;
        
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
  
  // Filter places based on search text if provided
  const filteredPlaces = places.filter(place => {
    // Apply search text filter
    if (searchText) {
      const matchesSearch = 
        place.name.toLowerCase().includes(searchText.toLowerCase()) || 
        (place.category && place.category.toLowerCase().includes(searchText.toLowerCase())) || 
        (place.tags && place.tags.some((tag: string) => tag?.toLowerCase().includes(searchText.toLowerCase())));
      
      if (!matchesSearch) return false;
    }
    
    // If we're using mock data, apply the filters here since the Supabase query wasn't effective
    if (locations.length === 0) {
      // Category filter
      if (categoryFilter && place.category !== categoryFilter) {
        return false;
      }
      
      // LGBT status filter
      if (lgbtStatusFilter && place.lgbt_status !== lgbtStatusFilter) {
        return false;
      }
      
      // Verified filter
      if (verifiedOnly && !place.verified) {
        return false;
      }
    }
    
    return true;
  });

  return { filteredPlaces, isLoading, error };
}
