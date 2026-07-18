
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { UserProvider } from "./contexts/UserContext";
import { AuthGuard } from "./components/auth/AuthGuard";
import DiscoverPage from "./pages/DiscoverPage";
import ConnectPage from "./pages/ConnectPage";
import EventsPage from "./pages/EventsPage";
import ResourcesPage from "./pages/ResourcesPage";
import ProfilePage from "./pages/ProfilePage";
import ComingSoonPage from "./pages/ComingSoonPage";
import NotFound from "./pages/NotFound";
import GroupDetailPage from "./pages/GroupDetailPage";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import SafetyPage from "./pages/SafetyPage";
import SuggestPlacePage from "./pages/SuggestPlacePage";
import PlaceDetailPage from "./pages/PlaceDetailPage";
import SavedPage from "./pages/SavedPage";
import NewGroupPage from "./pages/NewGroupPage";

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
        <UserProvider>
          <BrowserRouter basename={BASE_PATH}>
            <Routes>
              {/* Public routes - accessible without authentication */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/update-password" element={<UpdatePasswordPage />} />

              {/* App shell: the map and resources are public so anyone can
                  discover places; personal/community areas require sign-in. */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<DiscoverPage />} />
                <Route path="/place/:placeId" element={<PlaceDetailPage />} />
                <Route path="/saved" element={<SavedPage />} />
                <Route path="/safety" element={<SafetyPage />} />
                <Route
                  path="/suggest"
                  element={
                    <AuthGuard>
                      <SuggestPlacePage />
                    </AuthGuard>
                  }
                />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route
                  path="/feed"
                  element={
                    <ComingSoonPage
                      title="Community Feed — coming soon"
                      description="A place to share tips and moments tied to real places, with proper moderation. We're building it carefully rather than quickly."
                    />
                  }
                />
                {/* Group browsing is public (a traveler's first stop);
                    joining and creating require sign-in */}
                <Route path="/connect" element={<ConnectPage />} />
                <Route path="/connect/groups/:groupId" element={<GroupDetailPage />} />
                <Route
                  path="/connect/new"
                  element={
                    <AuthGuard>
                      <NewGroupPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <AuthGuard>
                      <ProfilePage />
                    </AuthGuard>
                  }
                />
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
