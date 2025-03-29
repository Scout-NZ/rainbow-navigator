
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function AuthPopup() {
  useEffect(() => {
    const handleAuth = async () => {
      try {
        const currentOrigin = window.location.origin;
        const redirectUrl = `${currentOrigin}/auth/callback`;
        
        console.log("Auth popup opened, initiating Google OAuth");
        
        const { error } = await supabase.auth.signInWithOAuth({
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
          window.close();
        }
      } catch (error) {
        console.error("Caught error in popup auth:", error);
        window.close();
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <h2 className="mt-4 text-xl font-semibold">Connecting to Google...</h2>
      <p className="text-muted-foreground">Please wait while we complete your authentication.</p>
      <p className="text-muted-foreground mt-4">This window will automatically close when complete.</p>
    </div>
  );
}
