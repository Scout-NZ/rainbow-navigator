
// Map container style
export const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

// City coordinates for New Zealand locations
export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Auckland': { lat: -36.8485, lng: 174.7633 },
  'Wellington': { lat: -41.2865, lng: 174.7762 },
  'Christchurch': { lat: -43.5320, lng: 172.6306 },
  'Hamilton': { lat: -37.7870, lng: 175.2793 },
  'Tauranga': { lat: -37.6878, lng: 176.1651 },
  'Dunedin': { lat: -45.8788, lng: 170.5028 },
  'Waikato': { lat: -37.7870, lng: 175.2793 },
  'Wairarapa': { lat: -41.0000, lng: 175.6500 },
  'Kapiti': { lat: -40.9000, lng: 175.0000 },
  'National': { lat: -41.0000, lng: 174.0000 }, // Center of NZ
  'Taupō': { lat: -38.6857, lng: 176.0702 },
  'Palmerston North': { lat: -40.3564, lng: 175.6110 },
  'Whanganui': { lat: -39.9300, lng: 175.0500 },
  'Whangarei': { lat: -35.7275, lng: 174.3166 },
  'Porirua': { lat: -41.1335, lng: 174.8430 },
  'Nelson': { lat: -41.2706, lng: 173.2840 },
  'Timaru': { lat: -44.3969, lng: 171.2550 },
  'Napier': { lat: -39.4928, lng: 176.9120 },
  'Invercargill': { lat: -46.4132, lng: 168.3538 },
  'Taranaki': { lat: -39.0556, lng: 174.0752 }
};

// Default location (Auckland, New Zealand)
export const DEFAULT_LOCATION = { lat: -36.8485, lng: 174.7633 };

// Google Maps API key
export const GOOGLE_MAPS_API_KEY = 'AIzaSyDK3hZtsdLtb8zsTT5mzzdDCC8Nj5O2wyQ';

// Loader ID - consistent across all components
export const LOADER_ID = 'rainbow-navigator-maps';

// Libraries to load with Google Maps
export const libraries = ['places'] as ['places' | 'drawing' | 'geometry' | 'visualization'];

// Map options for Google Maps
export const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
};

// Get coordinates for a given city
export const getCityCoordinates = (city: string | null): { lat: number; lng: number } => {
  if (!city) return DEFAULT_LOCATION;
  
  // Try to find exact match
  if (CITY_COORDINATES[city]) {
    return CITY_COORDINATES[city];
  }
  
  // Try case-insensitive match
  const normalizedCity = city.toLowerCase();
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (key.toLowerCase() === normalizedCity) {
      return coords;
    }
  }
  
  // If no match found, return default
  console.log(`No coordinates found for city: ${city}, using default`);
  return DEFAULT_LOCATION;
};

// Transform Supabase location to app location format
export const transformLocation = (location: any) => {
  // Ensure that type and category are included in tags
  let tags = location.tags || [];
  
  // Add type and category to tags if they don't already exist
  if (location.type && !tags.includes(location.type.toLowerCase())) {
    tags.push(location.type.toLowerCase());
  }
  
  if (location.category && !tags.includes(location.category.toLowerCase())) {
    tags.push(location.category.toLowerCase());
  }
  
  // Get coordinates based on the location's city or use the provided lat/lng
  const coordinates = location.lat && location.lng 
    ? { lat: location.lat, lng: location.lng }
    : getCityCoordinates(location.city);
  
  return {
    id: location.id,
    name: location.name,
    type: location.type || 'business',
    category: location.category,
    tags: tags,
    description: location.description || '',
    location: {
      address: location.address || '',
      neighbourhood: location.neighbourhood || '',
      city: location.city || '',
      lat: coordinates.lat,
      lng: coordinates.lng
    },
    contact: {
      phone: location.phone || '',
      email: location.email || '',
      website: location.website || ''
    },
    imageUrl: location.image_url || '',
    verified: location.verified || false,
    lgbt_status: location.lgbt_status || null
  };
};

// Custom marker icons based on place type
export const getMarkerIcon = (type: string, lgbtStatus: string | null) => {
  // Set base color based on type
  let fillColor = '#4B5563'; // default gray
  
  if (type.toLowerCase() === 'business') {
    fillColor = '#F59E0B'; // amber
  } else if (type.toLowerCase() === 'event') {
    fillColor = '#8B5CF6'; // purple
  } else if (type.toLowerCase() === 'resource') {
    fillColor = '#10B981'; // emerald
  }
  
  // Modify color for LGBT status
  if (lgbtStatus === 'lgbt_owned' || lgbtStatus === 'lgbt_managed') {
    fillColor = '#EC4899'; // pink
  } else if (lgbtStatus === 'ally') {
    fillColor = '#3B82F6'; // blue
  }
  
  // For Google Maps we use SVG path with proper Point object for anchor
  return {
    path: 'M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z',
    fillColor: fillColor,
    fillOpacity: 0.9,
    strokeWeight: 1,
    strokeColor: '#FFFFFF',
    scale: 1.5,
    anchor: new google.maps.Point(12, 24),
  };
};
