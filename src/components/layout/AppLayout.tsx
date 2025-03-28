
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { BottomNavigation } from "./BottomNavigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AppLayout() {
  const [isScrolled, setIsScrolled] = useState(false);

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
      <header 
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200 bg-background",
          isScrolled ? "border-b shadow-sm" : ""
        )}
      >
        <div className="container px-4 py-3 mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/bd55a184-9d3b-4c0b-b50c-b212d4be16a8.png" 
              alt="Rainbow Navigator" 
              className="h-10"
            />
            <h1 className="text-xl font-bold sr-only md:not-sr-only rainbow-text">Rainbow Navigator</h1>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search" 
              className="pl-9 rounded-full bg-muted/50 border-none" 
            />
          </div>
        </div>
      </header>
      
      <main className="flex-1 container px-4 pt-4 mx-auto">
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
