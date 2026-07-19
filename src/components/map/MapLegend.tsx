import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_COLORS, getMarkerSvgUri } from "./mapUtils";

// Small overlay explaining the markers. Shows the real marker artwork so the
// legend always matches the map. Collapsed by default so it never fights the
// map for space on a phone screen.
export function MapLegend() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button
        size="sm"
        variant="secondary"
        className="absolute bottom-3 left-3 z-10 rounded-full shadow-md h-8 px-3"
        onClick={() => setOpen(true)}
        aria-label="Show map legend"
      >
        <HelpCircle className="h-4 w-4 mr-1" aria-hidden="true" /> Legend
      </Button>
    );
  }

  return (
    <div className="absolute bottom-3 left-3 z-10 bg-background/95 backdrop-blur rounded-lg shadow-lg border p-3 w-56 text-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">Legend</span>
        <button onClick={() => setOpen(false)} aria-label="Close legend">
          <X className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mb-2">
        {Object.keys(CATEGORY_COLORS).map((category) => (
          <div key={category} className="flex items-center gap-1.5">
            <img
              src={getMarkerSvgUri(category, null)}
              alt=""
              aria-hidden="true"
              className="h-5 w-auto shrink-0"
            />
            <span className="text-xs">{category}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 border-t pt-2">
        <div className="flex items-center gap-1.5">
          <img
            src={getMarkerSvgUri("Community", "lgbt_owned")}
            alt=""
            aria-hidden="true"
            className="h-6 w-auto shrink-0"
          />
          <span className="text-xs">Big + gold ring: rainbow owned</span>
        </div>
        <div className="flex items-center gap-1.5">
          <img
            src={getMarkerSvgUri("Community", "ally")}
            alt=""
            aria-hidden="true"
            className="h-4 w-auto shrink-0 ml-1"
          />
          <span className="text-xs ml-1">Small + faded: ally</span>
        </div>
      </div>
    </div>
  );
}
