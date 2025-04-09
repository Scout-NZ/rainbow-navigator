
import { useState } from "react";

type CategoryPlaceholderProps = {
  category: string;
  width?: number;
  height?: number;
  className?: string;
};

// Mapping categories to appropriate placeholder images
const categoryImageMap: Record<string, string> = {
  "Cafes": "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1000&auto=format",
  "Bars": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1000&auto=format",
  "Nightlife": "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000&auto=format",
  "Shopping": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1000&auto=format",
  "Services": "https://images.unsplash.com/photo-1556745753-b2904692b3cd?q=80&w=1000&auto=format",
  "Community": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000&auto=format",
  "Healthcare": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1000&auto=format",
  "default": "https://images.unsplash.com/photo-1573592371950-348a8f1d9f38?q=80&w=1000&auto=format"
};

export function CategoryPlaceholderImage({
  category,
  width = 300,
  height = 200,
  className = ""
}: CategoryPlaceholderProps) {
  const [imgError, setImgError] = useState(false);
  
  // Select appropriate image based on category or use default
  const imageUrl = categoryImageMap[category] || categoryImageMap["default"];
  
  // Rainbow gradient background as ultimate fallback
  const fallbackStyle = {
    backgroundImage: "linear-gradient(45deg, #FF5757, #FF914D, #FFDE59, #70CE88, #5E9CF5, #9B87F5, #D069C3)",
    width: `${width}px`,
    height: `${height}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  // Handle image load error
  const handleError = () => {
    console.log(`Failed to load image for category: ${category}`);
    setImgError(true);
  };

  if (imgError) {
    return (
      <div style={fallbackStyle} className={`rounded-lg ${className}`}>
        <span className="text-white font-bold text-lg">{category}</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={`${category} image`}
      width={width}
      height={height}
      className={`object-cover rounded-lg ${className}`}
      onError={handleError}
    />
  );
}
