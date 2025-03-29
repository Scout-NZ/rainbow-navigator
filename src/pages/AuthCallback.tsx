
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle OAuth callback with hash fragments
    const handleAuthCallback = async () => {
      try {
        // Get the current URL parameters to detect errors
        const url = new URL(window.location.href);
        const errorDescription = url.searchParams.get('error_description');
        
        if (errorDescription) {
          throw new Error(errorDescription);
        }

        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // Redirect to home page if authentication was successful
        toast({
          title: 'Success',
          description: 'You have been signed in successfully.',
        });
        
        navigate('/', { replace: true });
      } catch (err: any) {
        console.error('Error during auth callback:', err);
        setError(err.message || 'Authentication failed');
        toast({
          title: 'Authentication Error',
          description: err.message || 'Failed to complete authentication',
          variant: 'destructive',
        });
        
        // Wait a moment before redirecting on error
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {error ? (
        <>
          <div className="text-destructive text-xl mb-4">Authentication Error</div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p>Redirecting back to login...</p>
        </>
      ) : (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <h2 className="mt-4 text-xl font-semibold">Completing login...</h2>
          <p className="text-muted-foreground">Please wait while we redirect you.</p>
        </>
      )}
    </div>
  );
}
