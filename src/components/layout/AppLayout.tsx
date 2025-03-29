
import { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { BottomNavigation } from "./BottomNavigation";
import { MessageCircle, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatBot } from "@/components/ai/ChatBot";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";

export function AppLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { user } = useUser();
  
  // Create a default profile for when userProfile is not available
  const defaultProfile = {
    name: "Guest",
    imageUrl: "",
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pb-16 flex flex-col">
      {/* Gradient background for the header area */}
      <div className={`absolute top-0 left-0 right-0 h-40 z-0 ${!isHomePage ? "bg-gradient-to-r from-rainbow-orange via-rainbow-yellow to-rainbow-green" : ""}`}></div>

      <header 
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200",
          isScrolled ? "bg-background border-b shadow-sm" : "bg-transparent"
        )}
      >
        <div className="container px-4 py-3 mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/profile" className="flex items-center">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarImage 
                  src={user?.user_metadata?.avatar_url || ""}
                  alt={user?.user_metadata?.name || "User"} 
                />
                <AvatarFallback>
                  {user?.user_metadata?.name ? user.user_metadata.name.substring(0, 2).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <h1 className={cn(
              "text-xl font-bold sr-only md:not-sr-only",
              isHomePage || isScrolled ? "rainbow-text" : "text-white"
            )}>Rainbow Navigator</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative max-w-xs w-full">
              <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input 
                type="search" 
                placeholder="Ask Navigator..." 
                className="pl-9 rounded-full border-none bg-white shadow-sm"
                style={{
                  backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.9)), linear-gradient(45deg, #FF5757, #FF914D, #FFDE59, #70CE88, #5E9CF5, #9B87F5, #D069C3)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                  border: "2px solid transparent",
                }}
                onClick={() => setShowChat(true)}
              />
            </div>
          </div>
        </div>
      </header>
      
      {showChat && <ChatBot onClose={() => setShowChat(false)} />}
      
      <main className={cn(
        "flex-1 container px-4 mx-auto",
        !isHomePage && "relative z-10 pt-4"
      )}>
        <Outlet />
      </main>
      
      <BottomNavigation />
    </div>
  );
}
