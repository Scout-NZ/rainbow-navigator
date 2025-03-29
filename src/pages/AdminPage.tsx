
import { CSVImporter } from "@/components/admin/CSVImporter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkSession = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    try {
      // For demo purposes, using magic link sign in
      const { data, error } = await supabase.auth.signInWithOtp({
        email: prompt("Enter your email to sign in:") || "",
      });
      
      if (error) throw error;
      
      toast({
        title: "Check your email",
        description: "We've sent you a login link!",
      });
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message || "An error occurred during sign in",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold rainbow-text">Admin Dashboard</h1>
        {user ? (
          <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
        ) : (
          <Button onClick={handleSignIn}>Sign In</Button>
        )}
      </div>
      
      <p className="text-muted-foreground">
        Use this dashboard to manage application data and settings.
      </p>
      
      {!user ? (
        <Alert variant="destructive" className="border-l-4 border-l-red-500">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You need to sign in to access admin features. Click the "Sign In" button above.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="default" className="border-l-4 border-l-amber-500">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Supabase Permissions Required</AlertTitle>
          <AlertDescription>
            You're signed in as {user.email}. If you encounter permission errors when importing data,
            make sure your account has the necessary permissions in Supabase.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mt-6">
        <CSVImporter />
      </div>
    </div>
  );
}
