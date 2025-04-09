
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { UserProvider } from "./contexts/UserContext";
import { UserProfileProvider } from "./contexts/UserProfile";
import { AuthGuard } from "./components/auth/AuthGuard";
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

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={BASE_PATH}>
          <UserProvider>
            <UserProfileProvider>
              <Routes>
                {/* Public routes - accessible without authentication */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/auth-popup" element={<AuthPopup />} />
                <Route path="/" element={<LandingPage />} />
                
                {/* Routes that require the AppLayout */}
                <Route element={
                  <AuthGuard>
                    <AppLayout />
                  </AuthGuard>
                }>
                  <Route path="/discover" element={<DiscoverPage />} />
                  <Route path="/connect" element={<ConnectPage />} />
                  <Route path="/connect/groups/:groupId" element={<GroupDetailPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/resources" element={<ResourcesPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/feed" element={<FeedPage />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </UserProfileProvider>
          </UserProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
