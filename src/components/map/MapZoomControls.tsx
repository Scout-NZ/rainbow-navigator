
import React from 'react';
import { Button } from "@/components/ui/button";

type MapZoomControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export function MapZoomControls({ onZoomIn, onZoomOut }: MapZoomControlsProps) {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
      <Button 
        size="sm" 
        variant="secondary" 
        className="h-8 w-8 p-0 rounded-full bg-white shadow-md"
        onClick={onZoomIn}
      >
        +
      </Button>
      <Button 
        size="sm" 
        variant="secondary" 
        className="h-8 w-8 p-0 rounded-full bg-white shadow-md"
        onClick={onZoomOut}
      >
        -
      </Button>
    </div>
  );
}
