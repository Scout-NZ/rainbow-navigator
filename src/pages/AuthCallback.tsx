
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle OAuth callback with hash fragments
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error during auth callback:', error);
      }
      
      // Redirect to home page regardless of success or failure
      // If there's an error, the user will be shown the login page
      navigate('/', { replace: true });
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <h2 className="mt-4 text-xl font-semibold">Completing login...</h2>
      <p className="text-muted-foreground">Please wait while we redirect you.</p>
    </div>
  );
}
