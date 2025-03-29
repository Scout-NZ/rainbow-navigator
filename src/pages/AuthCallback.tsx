
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Handle OAuth callback with hash fragments
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback initiated');
        
        // Get the current URL parameters to detect errors
        const url = new URL(window.location.href);
        const errorDescription = url.searchParams.get('error_description');
        
        if (errorDescription) {
          throw new Error(errorDescription);
        }

        // Get session data and check for errors
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (!data.session) {
          throw new Error('No session found');
        }

        console.log('Auth callback successful, user:', data.session.user.id);
        
        // Check if profile exists, create if it doesn't
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileError && profileError.code === 'PGRST116') {
          console.log('Profile not found, creating new profile');
          
          // Create a new profile
          const newProfile = {
            id: data.session.user.id,
            name: data.session.user.user_metadata?.name || data.session.user.user_metadata?.full_name || data.session.user.email?.split('@')[0] || 'User',
            username: data.session.user.email?.split('@')[0],
            interests: [],
            friends: 0,
            groups: 0,
            events: 0,
          };
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([newProfile]);
            
          if (insertError) {
            console.error('Error creating profile:', insertError);
            // Continue anyway - we'll try to use the session
          } else {
            console.log('New profile created successfully');
          }
        } else if (profileError) {
          console.error('Error fetching profile:', profileError);
          // Continue anyway - we'll try to use the session
        } else {
          console.log('Profile found:', profileData);
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
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isProcessing && !error && (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <h2 className="mt-4 text-xl font-semibold">Completing login...</h2>
          <p className="text-muted-foreground">Please wait while we redirect you.</p>
        </>
      )}
      {error && (
        <>
          <div className="text-destructive text-xl mb-4">Authentication Error</div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p>Redirecting back to login...</p>
        </>
      )}
    </div>
  );
}
