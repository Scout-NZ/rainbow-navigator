
import { CSVImporter } from "@/components/admin/CSVImporter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSigningIn(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Signed in successfully",
        description: `Welcome back, ${data.user?.email}!`,
      });
    } catch (error: any) {
      setAuthError(error.message || "An error occurred during sign in");
      toast({
        title: "Error signing in",
        description: error.message || "An error occurred during sign in",
        variant: "destructive",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleMagicLinkSignIn = async () => {
    if (!email) {
      setAuthError("Email is required");
      return;
    }

    setAuthError(null);
    setIsSigningIn(true);
    
    try {
      // Use signInWithOtp without redirect URL to avoid the localhost issue
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Explicitly don't use redirectTo
          emailRedirectTo: undefined
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Check your email",
        description: "We've sent you a login link. Please check your spam folder if you don't see it.",
      });
    } catch (error: any) {
      setAuthError(error.message || "An error occurred during sign in");
      toast({
        title: "Error sending login link",
        description: error.message || "An error occurred during sign in",
        variant: "destructive",
      });
    } finally {
      setIsSigningIn(false);
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
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Signed in as {user.email}</span>
            <Button onClick={handleSignOut} variant="outline" size="sm">Sign Out</Button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      
      <p className="text-muted-foreground">
        Use this dashboard to manage application data and settings.
      </p>
      
      {!user ? (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Admin Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSignIn} className="space-y-4">
              {authError && (
                <Alert variant="destructive">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Authentication Error</AlertTitle>
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="your@email.com" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Your password" 
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              onClick={handleMagicLinkSignIn} 
              variant="outline" 
              disabled={isSigningIn || !email}>
              {isSigningIn ? "Sending..." : "Sign in with Magic Link"}
            </Button>
            <Button 
              onClick={handlePasswordSignIn} 
              disabled={isSigningIn || !email || !password}>
              {isSigningIn ? "Signing in..." : "Sign in with Password"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <Alert variant="default" className="border-l-4 border-l-amber-500">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Supabase Permissions Required</AlertTitle>
            <AlertDescription>
              To import data, you need to be signed in with an account that has admin permissions, 
              or have Row Level Security (RLS) policies configured for the locations table.
            </AlertDescription>
          </Alert>
          
          <div className="mt-6">
            <CSVImporter />
          </div>
        </>
      )}
    </div>
  );
}
