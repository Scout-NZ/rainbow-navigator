
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
    queryKey: ['locations', searchText, categoryFilter, lgbtStatusFilter, verifiedOnly],
    queryFn: async () => {
      try {
        console.log("Fetching locations with filters:", { searchText, categoryFilter, lgbtStatusFilter, verifiedOnly });
        
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
        
        // Apply search text filter if provided
        if (searchText && searchText.trim() !== "") {
          query = query.or(`name.ilike.%${searchText}%,category.ilike.%${searchText}%,tags.cs.{${searchText.toLowerCase()}}`);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching locations:', error);
          throw error;
        }
        
        console.log("Fetched locations from Supabase:", data?.length || 0, "records");
        if (data && data.length > 0) {
          return data.map(transformLocation);
        } else {
          console.log("No locations found in database, using mock data as fallback");
          return [];
        }
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
  
  // Only use mockPlaces as fallback if no locations were found in the database
  const places = locations.length > 0 ? locations : mockPlaces;
  
  // Filter places based on search text if we're using mock data
  const filteredPlaces = places.filter(place => {
    // If we're already using the database results, we don't need to filter again
    if (locations.length > 0) {
      return true;
    }
    
    // For mock data, apply all filters manually
    // Apply search text filter
    if (searchText) {
      const matchesSearch = 
        place.name.toLowerCase().includes(searchText.toLowerCase()) || 
        (place.category && place.category.toLowerCase().includes(searchText.toLowerCase())) || 
        (place.tags && place.tags.some((tag: string) => tag?.toLowerCase().includes(searchText.toLowerCase())));
      
      if (!matchesSearch) return false;
    }
    
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
    
    return true;
  });

  return { filteredPlaces, isLoading, error };
}
