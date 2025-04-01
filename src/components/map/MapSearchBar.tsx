
import { Search, Locate, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type MapSearchBarProps = {
  filter: string;
  onFilterChange: (value: string) => void;
  onLocateMe: () => void;
  isLocating: boolean;
  onOpenFilters: () => void;
  activeFiltersCount: number;
};

export function MapSearchBar({ 
  filter, 
  onFilterChange, 
  onLocateMe, 
  isLocating, 
  onOpenFilters,
  activeFiltersCount
}: MapSearchBarProps) {
  return (
    <div className="p-3 bg-background border-b flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          type="search"
          placeholder="Search places..."
          className="pl-9 pr-4"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
        />
      </div>
      <Button 
        size="sm" 
        variant="outline" 
        className="rounded-full flex items-center gap-1 min-w-24"
        onClick={onLocateMe}
        disabled={isLocating}
      >
        <Locate className="h-4 w-4" />
        {isLocating ? "Locating..." : "Near Me"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="rounded-full flex items-center gap-1 relative"
        onClick={onOpenFilters}
      >
        <Filter className="h-4 w-4" />
        <span className="sr-only md:not-sr-only">Filters</span>
        {activeFiltersCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs"
          >
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
    </div>
  );
}
