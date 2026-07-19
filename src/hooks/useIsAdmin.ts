import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

// Whether the signed-in user is an app admin (profiles.is_admin).
// Server-side enforcement lives in RLS policies; this only controls UI.
export function useIsAdmin() {
  const { user } = useUser();
  const { data: isAdmin = false, isLoading } = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user!.id)
        .single();
      if (error) return false;
      return !!data?.is_admin;
    },
  });
  return { isAdmin, isLoading };
}
