
import { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// Google's multi-colour "G" mark (lucide has no brand icons)
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export default function AuthPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // For subdomain setup, we don't need a base path in the URL
  const basePath = import.meta.env.VITE_BASE_PATH || '/';
  
  // Get the location to redirect to after login
  const from = location.state?.from?.pathname || '/';
  
  // If user is already logged in, redirect to intended location or home
  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'You have been signed in successfully.',
      });
      
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({
        title: 'Error signing in',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Password floor: length beats complexity rules for real-world strength.
    // Server-side enforcement (leaked-password checks) lives in Supabase Auth.
    if (password.length < 10) {
      toast({
        title: 'Choose a longer password',
        description: 'At least 10 characters — a few random words work great and are easy to remember.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          // Send the confirmation link back to this deployment (base path aware)
          emailRedirectTo:
            window.location.origin +
            (import.meta.env.VITE_BASE_PATH || '') +
            '/auth/callback',
        },
      });

      if (error) throw error;
      
      // Check if email confirmation is needed, based on the session
      if (data.session) {
        // If we have a session, the user is automatically signed in (email verification disabled)
        toast({
          title: 'Account created',
          description: 'Your account has been created and you are now logged in!',
        });
        navigate(from, { replace: true });
      } else {
        // Email confirmation is required
        setRegistrationSuccess(true);
        toast({
          title: 'Verify your email',
          description: 'Please check your email for a confirmation link to complete registration.',
        });
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: 'Error signing up',
        description: error.message || 'Please check your information and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: 'Enter your email first',
        description: 'Type your email address above, then tap "Forgot password?" again.',
      });
      return;
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          window.location.origin +
          (import.meta.env.VITE_BASE_PATH || '') +
          '/auth/update-password',
      });
      if (error) throw error;
      toast({
        title: 'Reset email sent',
        description: `Check ${email} for a link to set a new password.`,
      });
    } catch (error: any) {
      console.error('Password reset failed:', error);
      toast({
        title: "Couldn't send reset email",
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo:
            window.location.origin +
            (import.meta.env.VITE_BASE_PATH || '') +
            '/auth/callback',
        },
      });

      if (error) throw error;
      // On success the browser is redirected to Google, so nothing else runs here.
    } catch (error: any) {
      console.error('Error with Google sign-in:', error);
      toast({
        title: 'Google sign-in failed',
        description: error.message || 'Could not start Google sign-in. Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="container flex items-center justify-center min-h-screen py-8">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome to Rainbow Navigator</CardTitle>
            <CardDescription>
              Sign in or create an account to connect with your community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {registrationSuccess ? (
              <div className="bg-muted p-4 rounded-md text-center space-y-4">
                <h3 className="font-medium text-lg">Email Verification Sent</h3>
                <p>
                  We've sent a verification link to <strong>{email}</strong>. Please check your inbox and spam folders.
                </p>
                <p className="text-sm text-muted-foreground">
                  If you don't receive an email within a few minutes, you can try signing in. Some email providers may delay delivery.
                </p>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => setRegistrationSuccess(false)}
                >
                  Back to Sign In
                </Button>
              </div>
            ) : (
              <>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
              >
                <GoogleIcon className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleEmailSignIn}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="email"
                            placeholder="m@example.com"
                            className="pl-10"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="password"
                            type="password"
                            className="pl-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                      </Button>
                      <button
                        type="button"
                        className="w-full text-sm text-muted-foreground hover:text-foreground underline"
                        onClick={handleForgotPassword}
                        disabled={isSubmitting}
                      >
                        Forgot password?
                      </button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={handleEmailSignUp}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="name"
                            placeholder="Your name"
                            className="pl-10"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-register">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="email-register"
                            placeholder="m@example.com"
                            className="pl-10"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-register">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="password-register"
                            type="password"
                            className="pl-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Creating account...' : 'Create Account'}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
