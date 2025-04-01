
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

// Get the base URL from environment or default to '/app'
// This allows the app to work in a subdirectory like rainbownavigator.com/app
const BASE_PATH = import.meta.env.VITE_BASE_PATH || '/app';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <UserProvider>
          <BrowserRouter basename={BASE_PATH}>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth-popup" element={<AuthPopup />} />
              
              <Route element={<AppLayout />}>
                <Route path="/" element={<DiscoverPage />} />
                <Route path="/connect" element={<ConnectPage />} />
                <Route path="/connect/groups/:groupId" element={<GroupDetailPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/feed" element={<FeedPage />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
