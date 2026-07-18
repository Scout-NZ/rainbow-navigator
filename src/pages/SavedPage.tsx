import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useSavedPlaces } from "@/hooks/useSavedPlaces";
import { PlaceCard } from "@/components/places/PlaceCard";

// Dedicated Saved tab (AllTrails pattern): your hearted places, one tap away.
export default function SavedPage() {
  const { user, loading } = useUser();
  const { savedPlaces, savedPlacesLoading } = useSavedPlaces();

  if (loading || savedPlacesLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center py-12">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-rainbow-gradient flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold">Save your favourite places</h1>
            <p className="text-muted-foreground text-sm">
              Sign in to heart places on the map and keep them here for quick access.
            </p>
            <Button asChild className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover">
              <Link to="/auth">Sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <h1 className="text-2xl font-bold mb-4">Saved</h1>
      {savedPlaces.length === 0 ? (
        <Card className="text-center">
          <CardContent className="pt-8 pb-8 space-y-3">
            <Heart className="h-8 w-8 text-primary mx-auto" aria-hidden="true" />
            <h2 className="font-medium">No saved places yet</h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Tap the heart on any place to keep it here.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/">Explore places</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedPlaces.map((place: any) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}
