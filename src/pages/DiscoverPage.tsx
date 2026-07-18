
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Grid, Coffee, Music, Heart, ShoppingBag, Settings, Users, Stethoscope, List, Map as MapIcon, MapPin, Search, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { PlaceCard } from "@/components/places/PlaceCard";
import { useLocations } from "@/components/map/useLocations";
import { getCityCoordinates } from "@/components/map/mapUtils";

// Categories with their icons
const categories = [
  { name: "All", icon: Grid },
  { name: "Cafes", icon: Coffee },
  { name: "Bars", icon: Music },
  { name: "Nightlife", icon: Heart },
  { name: "Shopping", icon: ShoppingBag },
  { name: "Services", icon: Settings },
  { name: "Community", icon: Users },
  { name: "Healthcare", icon: Stethoscope }
];

const CITY_OPTIONS = [
  "All cities", "Wellington", "Auckland", "Christchurch", "Hamilton", "Tauranga",
  "Dunedin", "Napier", "Nelson", "Palmerston North", "Porirua",
  "Whanganui", "Whangarei", "Invercargill", "Timaru",
];

// AllTrails-style Explore: search + filter pills up top, list view by
// default with a map toggle, place cards linking to full place pages.
export default function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("Wellington");
  const [searchText, setSearchText] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [view, setView] = useState<"list" | "map">("list");

  const { filteredPlaces: allPlaces, isLoading } = useLocations({});

  const listPlaces = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return allPlaces
      .filter((place: any) => {
        if (selectedCategory !== "All" && place.category !== selectedCategory) return false;
        if (selectedCity !== "All cities" && place.location.city !== selectedCity) return false;
        if (verifiedOnly && !place.verified) return false;
        if (q) {
          const haystack = [
            place.name,
            place.category,
            place.location.city,
            place.location.address,
            ...(place.tags || []),
          ].filter(Boolean).join(" ").toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a: any, b: any) => {
        // Verified places first (the trusted layer), then alphabetical
        if (a.verified !== b.verified) return a.verified ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }, [allPlaces, selectedCategory, selectedCity, verifiedOnly, searchText]);

  return (
    <div className="space-y-4 pb-6">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Explore</h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/safety">
              <ShieldCheck className="h-4 w-4 mr-1" aria-hidden="true" />
              Safety
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover">
            <Link to="/suggest">Suggest a place</Link>
          </Button>
        </div>
      </div>

      {/* Search + city */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search places, categories, tags..."
            className="pl-9 rounded-full"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            aria-label="Search places"
          />
        </div>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-[150px] rounded-full" aria-label="Choose a city">
            <MapPin className="h-4 w-4 mr-1 text-primary" aria-hidden="true" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CITY_OPTIONS.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filter pills + view toggle */}
      <div className="flex items-center gap-2">
        <ScrollArea className="flex-1 whitespace-nowrap" orientation="horizontal">
          <div className="flex items-center gap-2 px-1 py-1">
            {categories.map(category => (
              <Badge
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                className={`rounded-full cursor-pointer px-3 py-1.5 ${
                  selectedCategory === category.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted/50"
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <category.icon className="h-4 w-4 mr-1.5" aria-hidden="true" />
                {category.name}
              </Badge>
            ))}
            <Badge
              variant={verifiedOnly ? "default" : "outline"}
              className={`rounded-full cursor-pointer px-3 py-1.5 ${
                verifiedOnly
                  ? "bg-green-600 text-white"
                  : "bg-background hover:bg-muted/50"
              }`}
              onClick={() => setVerifiedOnly(v => !v)}
            >
              ✓ Verified only
            </Badge>
          </div>
        </ScrollArea>
        <div className="flex rounded-full border overflow-hidden shrink-0" role="group" aria-label="View mode">
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            className={`rounded-none px-3 ${view === "list" ? "bg-primary" : ""}`}
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
          >
            <List className="h-4 w-4 mr-1" aria-hidden="true" /> List
          </Button>
          <Button
            variant={view === "map" ? "default" : "ghost"}
            size="sm"
            className={`rounded-none px-3 ${view === "map" ? "bg-primary" : ""}`}
            onClick={() => setView("map")}
            aria-pressed={view === "map"}
          >
            <MapIcon className="h-4 w-4 mr-1" aria-hidden="true" /> Map
          </Button>
        </div>
      </div>

      {view === "map" ? (
        <div className="rounded-xl overflow-hidden h-[70vh] shadow-md">
          <InteractiveMap
            className="h-full"
            defaultLocation={getCityCoordinates(selectedCity === "All cities" ? "Wellington" : selectedCity)}
            categoryFilter={selectedCategory === "All" ? null : selectedCategory}
            lgbtStatusFilter={null}
          />
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading places..." : `${listPlaces.length} place${listPlaces.length === 1 ? "" : "s"}`}
            {selectedCity !== "All cities" ? ` in ${selectedCity}` : " across Aotearoa"}
          </p>
          {!isLoading && listPlaces.length === 0 ? (
            <div className="text-center py-14 space-y-3">
              <p className="text-muted-foreground">No places match those filters yet.</p>
              <Button asChild variant="outline" size="sm">
                <Link to="/suggest">Know one? Suggest it</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {listPlaces.map((place: any) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
