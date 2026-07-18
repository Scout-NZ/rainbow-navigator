
import { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { BottomNavigation } from "./BottomNavigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";

export function AppLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { user, loading } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Determine which image URL to use for the avatar in the header
  const profileImageUrl = user?.imageUrl || user?.avatar || "";

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
            {user && (
              <Link to="/profile" className="flex items-center" aria-label="Your profile">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage
                    src={profileImageUrl}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback>
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt=""
              aria-hidden="true"
              className="h-8 w-8"
            />
            <h1 className={cn(
              "text-xl font-bold",
              isHomePage || isScrolled ? "rainbow-text" : "text-white"
            )}>Rainbow Navigator</h1>
          </div>

          {!user && !loading && (
            <Button
              asChild
              size="sm"
              className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover rounded-full px-4"
            >
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>
      </header>

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
