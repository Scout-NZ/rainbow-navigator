
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Calendar, Heart, Map, Sparkles, Users } from "lucide-react";

// The MAP is the heart of the app, so it takes the raised centre button —
// land anywhere, tap the middle, see what's around you. Profile lives
// behind the avatar in the header; the fifth slot belongs to Community.
const navItems = [
  { label: "Connect", path: "/connect", icon: Users },
  { label: "Events", path: "/events", icon: Calendar },
  { label: "Map", path: "/", icon: Map, center: true },
  { label: "Saved", path: "/saved", icon: Heart },
  { label: "Community", path: "/community", icon: Sparkles },
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
                aria-label="Explore the map"
                aria-current={isActive ? "page" : undefined}
              >
                <div className={cn(
                  "h-12 w-12 rounded-full bg-rainbow-gradient shadow-lg flex items-center justify-center",
                  isActive && "ring-2 ring-primary ring-offset-2"
                )}>
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
