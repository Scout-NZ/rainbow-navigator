
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
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
        return (data || []).map(transformLocation);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        toast({
          title: "Couldn't load places",
          description: "Please check your connection and try again.",
          variant: "destructive"
        });
        return [];
      }
    }
  });
  
  // Filtering happens in the Supabase query above; never substitute mock data
  // for real results — an empty database should look empty, not fake-populated.
  return { filteredPlaces: locations, isLoading, error };
}
