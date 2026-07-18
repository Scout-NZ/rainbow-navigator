
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Calendar, Heart, Map, Plus, User } from "lucide-react";

// AllTrails-style tab bar: the contribution action (Suggest) sits centre,
// like their Navigate/record button.
const navItems = [
  { label: "Explore", path: "/", icon: Map },
  { label: "Saved", path: "/saved", icon: Heart },
  { label: "Suggest", path: "/suggest", icon: Plus, center: true },
  { label: "Events", path: "/events", icon: Calendar },
  { label: "Profile", path: "/profile", icon: User },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-sm z-50">
      <nav className="flex items-center justify-around max-w-md mx-auto" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === "/"
              ? location.pathname === "/" || location.pathname.startsWith("/place/")
              : location.pathname.startsWith(item.path);

          if (item.center) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="nav-item -mt-4"
                aria-label="Suggest a place"
              >
                <div className="h-12 w-12 rounded-full bg-rainbow-gradient shadow-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <span className="text-xs font-medium mt-0.5">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn("nav-item", isActive ? "active text-primary" : "text-muted-foreground")}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
