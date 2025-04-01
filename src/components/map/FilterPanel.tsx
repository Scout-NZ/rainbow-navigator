
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const categoryFilters = [
  "All",
  "Cafes",
  "Bars",
  "Nightlife", 
  "Shopping",
  "Services",
  "Healthcare",
  "Community"
];

const lgbtStatusFilters = [
  { value: "lgbt_owned", label: "🏳️‍🌈 LGBT+ Owned" },
  { value: "lgbt_managed", label: "🏳️‍🌈 LGBT+ Managed" },
  { value: "ally", label: "❤️ Ally" }
];

type FilterPanelProps = {
  onClose: () => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  selectedLgbtStatus: string | null;
  onLgbtStatusChange: (status: string | null) => void;
  verifiedOnly: boolean;
  onVerifiedChange: (verified: boolean) => void;
};

export function FilterPanel({
  onClose,
  selectedCategory,
  onCategoryChange,
  selectedLgbtStatus,
  onLgbtStatusChange,
  verifiedOnly,
  onVerifiedChange
}: FilterPanelProps) {
  const handleCategorySelect = (category: string) => {
    onCategoryChange(category === "All" ? null : category);
  };
  
  const handleLgbtStatusSelect = (status: string) => {
    onLgbtStatusChange(status === selectedLgbtStatus ? null : status);
  };

  const handleReset = () => {
    onCategoryChange(null);
    onLgbtStatusChange(null);
    onVerifiedChange(false);
  };

  return (
    <div className="p-4 bg-card border rounded-lg shadow-lg max-w-md w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filter Places</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator className="mb-4" />
      
      <div className="space-y-6">
        {/* Category filters */}
        <div>
          <h4 className="font-medium mb-2">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {categoryFilters.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === (category === "All" ? null : category) ? "default" : "outline"}
                className={`rounded-full cursor-pointer ${
                  selectedCategory === (category === "All" ? null : category)
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted/50"
                }`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* LGBT+ Status filters */}
        <div>
          <h4 className="font-medium mb-2">LGBT+ Status</h4>
          <div className="flex flex-wrap gap-2">
            {lgbtStatusFilters.map((status) => (
              <Badge
                key={status.value}
                variant={selectedLgbtStatus === status.value ? "default" : "outline"}
                className={`rounded-full cursor-pointer ${
                  selectedLgbtStatus === status.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted/50"
                }`}
                onClick={() => handleLgbtStatusSelect(status.value)}
              >
                {status.label}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Verified filter */}
        <div className="flex items-center space-x-2">
          <Switch 
            id="verified-filter" 
            checked={verifiedOnly} 
            onCheckedChange={onVerifiedChange}
          />
          <Label htmlFor="verified-filter">Verified locations only</Label>
          <Badge className="ml-2 bg-green-100 text-green-800 border-green-300">
            ✓ Rainbow Tick
          </Badge>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" size="sm" onClick={handleReset}>
          Reset Filters
        </Button>
        <Button onClick={onClose}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
