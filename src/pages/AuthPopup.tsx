
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function AuthPopup() {
  const [error, setError] = useState<string | null>(null);
  
  // For subdomain setup, we don't need a base path in the URL
  const basePath = import.meta.env.VITE_BASE_PATH || '/';

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const currentOrigin = window.location.origin;
        // Construct the redirect URL using the current origin (app.rainbownavigator.com)
        const redirectUrl = `${currentOrigin}${basePath}auth/callback`;
        
        console.log("Auth popup opened, initiating Google OAuth with redirect URL:", redirectUrl);
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          },
        });

        if (error) {
          console.error("Error in popup auth:", error);
          setError(error.message);
          
          // Also notify the parent window about the error
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'AUTH_COMPLETE', 
              success: false, 
              error: error.message 
            }, window.location.origin);
          }
          
          // Don't close the window on error to let the user see the error message
        } else {
          console.log("OAuth initialized, awaiting redirect:", data);
        }
      } catch (error: any) {
        console.error("Caught error in popup auth:", error);
        setError(error.message);
        
        // Also notify the parent window about the error
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'AUTH_COMPLETE', 
            success: false, 
            error: error.message 
          }, window.location.origin);
        }
        
        // Don't close the window on error to let the user see the error message
      }
    };

    handleAuth();
  }, [basePath]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {error ? (
        <>
          <div className="text-destructive text-xl mb-4">Authentication Error</div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm">You can close this window and try again.</p>
        </>
      ) : (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <h2 className="mt-4 text-xl font-semibold">Connecting to Google...</h2>
          <p className="text-muted-foreground">Please wait while we complete your authentication.</p>
          <p className="text-muted-foreground mt-4">This window will automatically close when complete.</p>
        </>
      )}
    </div>
  );
}
