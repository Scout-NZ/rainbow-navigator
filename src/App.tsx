
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { UserProvider, useUser } from "./contexts/UserContext";
import DiscoverPage from "./pages/DiscoverPage";
import ConnectPage from "./pages/ConnectPage";
import EventsPage from "./pages/EventsPage";
import ResourcesPage from "./pages/ResourcesPage";
import ProfilePage from "./pages/ProfilePage";
import FeedPage from "./pages/FeedPage";
import NotFound from "./pages/NotFound";
import GroupDetailPage from "./pages/GroupDetailPage";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import AuthPopup from "./pages/AuthPopup";
import LandingPage from "./pages/LandingPage";

// Create a client
const queryClient = new QueryClient();

// Since we're using a subdomain instead of a subdirectory, we don't need a base path
// If environment variable is set, use it; otherwise, use '/'
const BASE_PATH = import.meta.env.VITE_BASE_PATH || '/';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // If not loading and no user, redirect to auth page
    if (!loading && !user) {
      console.log("User not authenticated, redirecting to auth page from:", location.pathname);
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate, location.pathname]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // We'll let the useEffect handle the redirect if there's no user
  return <>{children}</>;
};

// Auth route - redirects to home if already logged in
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && user) {
      console.log("User already authenticated, redirecting to home");
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return <>{children}</>;
};

// Root component to handle global session check
const RootNavigator = () => {
  const { loading } = useUser();
  const location = useLocation();
  
  // Special paths that don't need to be protected
  const isSpecialPath = 
    location.pathname === "/auth" || 
    location.pathname === "/auth/callback" || 
    location.pathname === "/auth-popup";
  
  if (loading && !isSpecialPath) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <Routes>
      <Route path="/auth" element={
        <AuthRoute>
          <AuthPage />
        </AuthRoute>
      } />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/auth-popup" element={<AuthPopup />} />
      
      <Route element={<AppLayout />}>
        <Route path="/" element={
          <ProtectedRoute>
            <DiscoverPage />
          </ProtectedRoute>
        } />
        <Route path="/connect" element={
          <ProtectedRoute>
            <ConnectPage />
          </ProtectedRoute>
        } />
        <Route path="/connect/groups/:groupId" element={
          <ProtectedRoute>
            <GroupDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/events" element={
          <ProtectedRoute>
            <EventsPage />
          </ProtectedRoute>
        } />
        <Route path="/resources" element={
          <ProtectedRoute>
            <ResourcesPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/feed" element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        } />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <UserProvider>
          <BrowserRouter basename={BASE_PATH}>
            <RootNavigator />
          </BrowserRouter>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
