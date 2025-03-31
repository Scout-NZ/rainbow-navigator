
import React from 'react';

type MapLoadingStateProps = {
  error: string | null;
};

export function MapLoadingState({ error }: MapLoadingStateProps) {
  return (
    <div className="flex items-center justify-center h-full bg-muted">
      {error ? (
        <div className="text-center p-4">
          <div className="mb-2 h-12 w-12 text-red-500 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-500">Map Error</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-xs mt-2">Please check the console for more details</p>
        </div>
      ) : (
        <>
          <div className="animate-spin mr-2 h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
          <span>Loading map...</span>
        </>
      )}
    </div>
  );
}
