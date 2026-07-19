import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_COLORS } from "./mapUtils";

// Small overlay explaining marker colours and sizes. Collapsed by default so
// it never fights the map for space on a phone screen.
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
    <div className="absolute bottom-3 left-3 z-10 bg-background/95 backdrop-blur rounded-lg shadow-lg border p-3 w-52 text-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">Legend</span>
        <button onClick={() => setOpen(false)} aria-label="Close legend">
          <X className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-2">
        {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
          <div key={category} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <span className="text-xs">{category}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1 border-t pt-2">
        <div className="flex items-center gap-1.5">
          <span
            className="h-3.5 w-3.5 rounded-full shrink-0 border-2"
            style={{ backgroundColor: "#16A34A", borderColor: "#FBBF24" }}
            aria-hidden="true"
          />
          <span className="text-xs">Big + gold ring: rainbow owned</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full shrink-0 opacity-60 ml-0.5"
            style={{ backgroundColor: "#16A34A" }}
            aria-hidden="true"
          />
          <span className="text-xs ml-0.5">Small + faded: ally</span>
        </div>
      </div>
    </div>
  );
}
