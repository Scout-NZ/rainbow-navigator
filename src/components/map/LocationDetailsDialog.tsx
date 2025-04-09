
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Globe, MapPin, Clock, Star } from "lucide-react";
import { CategoryPlaceholderImage } from "@/components/ui/CategoryPlaceholderImage";

// Define a type for the possible operating hours
interface OperatingHours {
  day: string;
  hours: string;
}

// Extend the Place type to include optional hours
interface ExtendedPlace {
  id: number;
  name: string;
  category: string;
  description?: string;
  verified?: boolean;
  location: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  lgbt_status?: 'lgbt_owned' | 'lgbt_managed' | 'ally';
  tags?: string[];
  featured?: boolean;
  imageUrl?: string;
  rating?: number;
  hours?: OperatingHours[]; // Optional hours property
}

interface LocationDetailsDialogProps {
  location: ExtendedPlace | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LocationDetailsDialog({ location, isOpen, onClose }: LocationDetailsDialogProps) {
  if (!location) return null;

  // Function to get category-specific styling
  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, { bg: string, text: string }> = {
      "Cafes": { bg: "bg-orange-100", text: "text-orange-800" },
      "Bars": { bg: "bg-blue-100", text: "text-blue-800" },
      "Nightlife": { bg: "bg-pink-100", text: "text-pink-800" },
      "Shopping": { bg: "bg-yellow-100", text: "text-yellow-800" },
      "Services": { bg: "bg-purple-100", text: "text-purple-800" },
      "Community": { bg: "bg-green-100", text: "text-green-800" },
      "Healthcare": { bg: "bg-cyan-100", text: "text-cyan-800" },
      "default": { bg: "bg-gray-100", text: "text-gray-800" }
    };

    return categoryColors[category] || categoryColors.default;
  };

  const colors = getCategoryColor(location.category);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{location.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Location Image */}
          <div className="h-60 relative rounded-lg overflow-hidden">
            {location.imageUrl ? (
              <img
                src={location.imageUrl}
                alt={location.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parentElement = (e.target as HTMLImageElement).parentElement;
                  if (parentElement) {
                    const placeholderDiv = document.createElement('div');
                    placeholderDiv.className = 'w-full h-full';
                    parentElement.appendChild(placeholderDiv);
                    
                    // Use CategoryPlaceholderImage instead of direct manipulation
                    const placeholderImgContainer = document.createElement('div');
                    placeholderImgContainer.className = 'w-full h-full';
                    placeholderDiv.appendChild(placeholderImgContainer);
                    
                    // React would normally handle this, but for error cases:
                    const img = document.createElement('img');
                    img.src = `https://images.unsplash.com/photo-1573592371950-348a8f1d9f38?q=80&w=1000&auto=format`;
                    img.alt = location.category;
                    img.className = 'w-full h-full object-cover';
                    placeholderImgContainer.appendChild(img);
                  }
                }}
              />
            ) : (
              <CategoryPlaceholderImage
                category={location.category}
                className="w-full h-full"
              />
            )}
          </div>
          
          {/* Location Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={`${colors.bg} ${colors.text}`}>{location.category}</Badge>
            {location.verified && (
              <Badge className="bg-green-100 text-green-800">✓ Verified</Badge>
            )}
            {location.lgbt_status && (
              <Badge variant={
                location.lgbt_status === 'lgbt_owned' ? 'lgbtOwned' :
                location.lgbt_status === 'lgbt_managed' ? 'lgbtManaged' : 'ally'
              }>
                {location.lgbt_status === 'lgbt_owned' ? '🏳️‍🌈 LGBT+ Owned' :
                 location.lgbt_status === 'lgbt_managed' ? '🏳️‍🌈 LGBT+ Managed' : '❤️ Ally'}
              </Badge>
            )}
            {location.tags?.map(tag => (
              <Badge variant="outline" key={tag}>{tag}</Badge>
            ))}
          </div>
          
          {/* Location Description */}
          {location.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-gray-700">{location.description}</p>
            </div>
          )}
          
          {/* Location Hours if available */}
          {location.hours && location.hours.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Hours
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {location.hours.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="font-medium">{item.day}</span>
                    <span>{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Location Address */}
          {location.location && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Address
              </h3>
              <p className="text-gray-700">
                {location.location.address && `${location.location.address}, `}
                {location.location.city && `${location.location.city}, `}
                {location.location.state && `${location.location.state} `}
                {location.location.zip && location.location.zip}
              </p>
            </div>
          )}
          
          {/* Contact Information */}
          {location.contact && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Contact</h3>
              <div className="space-y-2">
                {location.contact.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    <a href={`tel:${location.contact.phone}`} className="text-blue-600 hover:underline">
                      {location.contact.phone}
                    </a>
                  </div>
                )}
                {location.contact.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    <a 
                      href={location.contact.website.startsWith('http') ? location.contact.website : `https://${location.contact.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {location.contact.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Rating if available */}
          {location.rating && (
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-1 fill-current" />
              <span className="font-medium">{location.rating.toFixed(1)}</span>
              <span className="text-gray-500 ml-1">/ 5.0</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button>Get Directions</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
