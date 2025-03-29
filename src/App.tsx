
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { UserProvider } from "./contexts/UserContext";
import DiscoverPage from "./pages/DiscoverPage";
import ConnectPage from "./pages/ConnectPage";
import EventsPage from "./pages/EventsPage";
import ResourcesPage from "./pages/ResourcesPage";
import ProfilePage from "./pages/ProfilePage";
import FeedPage from "./pages/FeedPage";
import NotFound from "./pages/NotFound";
import GroupDetailPage from "./pages/GroupDetailPage";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DiscoverPage />} />
              <Route path="/connect" element={<ConnectPage />} />
              <Route path="/connect/groups/:groupId" element={<GroupDetailPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/feed" element={<FeedPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
