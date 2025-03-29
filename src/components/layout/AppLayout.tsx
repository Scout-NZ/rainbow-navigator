
import { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { BottomNavigation } from "./BottomNavigation";
import { MessageCircle, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatBot } from "@/components/ai/ChatBot";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { mockUserProfile } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

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
            <Link to="/">
              <img 
                src="/lovable-uploads/81d7e401-05ab-439f-9086-8a67457532e2.png" 
                alt="Rainbow Navigator" 
                className="h-10"
              />
            </Link>
            <h1 className={cn(
              "text-xl font-bold sr-only md:not-sr-only",
              isHomePage || isScrolled ? "rainbow-text" : "text-white"
            )}>Rainbow Navigator</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/profile" className="relative flex items-center">
              <Avatar className="h-9 w-9 border-2 border-white">
                <AvatarImage 
                  src={mockUserProfile.imageUrl}
                  alt={mockUserProfile.name} 
                />
                <AvatarFallback>{mockUserProfile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
            
            <Button 
              onClick={() => setShowChat(prev => !prev)}
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-rainbow-orange via-rainbow-yellow to-rainbow-green hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center gap-2 px-1 py-0.5">
                <MessageCircle className="h-5 w-5 text-white" />
                <span className="text-white">Chat with AI</span>
              </div>
            </Button>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search" 
                className="pl-9 rounded-full bg-white border-none" 
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

// Helper function in case cn is not directly imported
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
