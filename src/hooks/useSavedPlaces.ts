import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { transformLocation } from '@/components/map/mapUtils';
import { toast } from '@/components/ui/use-toast';

// Real, database-backed saved places (hearts) for the signed-in user.
export function useSavedPlaces() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const userId = user?.id;

  const { data: savedIds = [] } = useQuery({
    queryKey: ['saved-place-ids', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_places')
        .select('location_id');
      if (error) throw error;
      return (data || []).map((r: any) => r.location_id as string);
    },
  });

  const { data: savedPlaces = [], isLoading: savedPlacesLoading } = useQuery({
    queryKey: ['saved-places', userId, savedIds.join(',')],
    enabled: !!userId && savedIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .in('id', savedIds);
      if (error) throw error;
      return (data || []).map(transformLocation);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (locationId: string) => {
      if (!userId) throw new Error('not-signed-in');
      if (savedIds.includes(locationId)) {
        const { error } = await supabase
          .from('saved_places')
          .delete()
          .eq('user_id', userId)
          .eq('location_id', locationId);
        if (error) throw error;
        return false;
      }
      const { error } = await supabase
        .from('saved_places')
        .insert({ user_id: userId, location_id: locationId });
      if (error) throw error;
      return true;
    },
    onSuccess: (nowSaved) => {
      queryClient.invalidateQueries({ queryKey: ['saved-place-ids'] });
      queryClient.invalidateQueries({ queryKey: ['saved-places'] });
      toast({ title: nowSaved ? 'Place saved ❤️' : 'Removed from saved places' });
    },
    onError: () => {
      toast({
        title: "Couldn't update saved places",
        description: 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    savedIds,
    savedPlaces,
    savedPlacesLoading,
    isSaved: (locationId: string) => savedIds.includes(locationId),
    toggleSave: (locationId: string) => toggleMutation.mutate(locationId),
    isToggling: toggleMutation.isPending,
  };
}
