import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useSavedPlaces } from "@/hooks/useSavedPlaces";

// AllTrails-style place card: photo on top with the save-heart overlaid on
// its corner, then name, location line and one dense metadata row.
export function PlaceCard({ place }: { place: any }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const { isSaved, toggleSave } = useSavedPlaces();

  const saved = user && isSaved(String(place.id));

  const handleHeart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/auth");
      return;
    }
    toggleSave(String(place.id));
  };

  return (
    <Link to={`/place/${place.id}`} className="block group">
      <Card className="overflow-hidden border-0 shadow hover:shadow-md transition-all h-full rounded-xl">
        <div
          className="h-40 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${place.imageUrl})` }}
        >
          <button
            onClick={handleHeart}
            aria-label={saved ? `Remove ${place.name} from saved` : `Save ${place.name}`}
            className="absolute top-2 right-2 h-9 w-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Heart
              className={`h-5 w-5 ${saved ? "fill-primary text-primary" : "text-gray-700"}`}
            />
          </button>
          {place.verified && (
            <Badge className="absolute bottom-2 left-2 bg-green-100 text-green-800 border-green-300">
              ✓ Verified
            </Badge>
          )}
        </div>
        <CardContent className="p-3 space-y-1">
          <h3 className="font-semibold leading-tight truncate group-hover:text-primary transition-colors">
            {place.name}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {place.location.city}
            {place.location.address ? ` · ${place.location.address}` : ""}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {place.category}
            {place.lgbt_status === "lgbt_owned" && " · 🏳️‍🌈 LGBT+ owned"}
            {place.lgbt_status === "lgbt_managed" && " · 🏳️‍🌈 LGBT+ managed"}
            {place.lgbt_status === "ally" && " · ❤️ Ally"}
            {!place.verified && " · Community submitted"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
