import { getCategoryImage } from "@/lib/categoryImages";

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
  'Taranaki': { lat: -39.0556, lng: 174.0752 },
  'Hastings': { lat: -39.6381, lng: 176.8481 },
  'Lower Hutt': { lat: -41.2094, lng: 174.9086 },
  'Upper Hutt': { lat: -41.1244, lng: 175.0707 },
  'Levin': { lat: -40.6218, lng: 175.2866 },
  'Hunterville': { lat: -39.9333, lng: 175.5667 }
};

// Default location (Wellington — the pilot city)
export const DEFAULT_LOCATION = { lat: -41.2865, lng: 174.7762 };

// Google Maps API key - set VITE_GOOGLE_MAPS_API_KEY in .env (see .env.example).
// Browser Maps keys are always publicly visible; this one is restricted by
// HTTP referrer (rainbow-navigator.vercel.app, *.vercel.app, localhost:8080)
// and to the Maps JavaScript API only, in Google Cloud Console.
export const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCJ_KTxA8CLn-cPohBh4QSrVdUWwxhb7T4';

// Loader ID - ensure it's unique and consistent across components
export const LOADER_ID = 'rainbow-navigator-maps-loader';

// Libraries to load with Google Maps
export const libraries = ['places'] as ['places'];

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
  
  // Make sure tags is an array
  if (!Array.isArray(tags)) {
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch (e) {
        tags = [tags];
      }
    } else {
      tags = [];
    }
  }
  
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
      neighbourhood: location.neighbourhood || '', // Add default value for neighbourhood
      city: location.city || '',
      lat: coordinates.lat,
      lng: coordinates.lng
    },
    contact: {
      phone: location.phone || '',
      email: location.email || '',
      website: location.website || ''
    },
    imageUrl: location.image_url || getCategoryImage(location.category),
    verified: location.verified || false,
    lgbt_status: location.lgbt_status || null
  };
};

// One colour per category so the map reads at a glance
export const CATEGORY_COLORS: Record<string, string> = {
  Cafes: '#D97706',      // amber
  Bars: '#7C3AED',       // violet
  Nightlife: '#DB2777',  // pink
  Shopping: '#2563EB',   // blue
  Services: '#0D9488',   // teal
  Community: '#16A34A',  // green
  Healthcare: '#DC2626', // red
};

export const getCategoryColor = (category: string | null | undefined): string =>
  CATEGORY_COLORS[category ?? ''] ?? '#4B5563';

// White glyph shown inside each marker so the pin says WHAT the place is,
// not just which colour bucket it falls in. 24x24 viewBox paths.
const CATEGORY_GLYPHS: Record<string, string> = {
  // coffee cup
  Cafes: 'M20,3H4v10c0,2.21,1.79,4,4,4h6c2.21,0,4-1.79,4-4v-3h2c1.11,0,2-0.9,2-2V5C22,3.89,21.11,3,20,3z M20,8h-2V5h2V8z M4,19h16v2H4V19z',
  // cocktail glass
  Bars: 'M21,5V3H3v2l8,9v5H6v2h12v-2h-5v-5L21,5z M7.43,7L5.66,5h12.69l-1.78,2H7.43z',
  // music note
  Nightlife: 'M12,3v10.55c-0.59-0.34-1.27-0.55-2-0.55c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4V7h4V3H12z',
  // shopping bag
  Shopping: 'M18,6h-2c0-2.21-1.79-4-4-4S8,3.79,8,6H6C4.9,6,4,6.9,4,8v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8C20,6.9,19.1,6,18,6z M12,4c1.1,0,2,0.9,2,2h-4C10,4.9,10.9,4,12,4z M12,10c-2.76,0-5-2.24-5-5h2c0,1.66,1.34,3,3,3s3-1.34,3-3h2C17,7.76,14.76,10,12,10z',
  // wrench
  Services: 'M22.7,19l-9.1-9.1c0.9-2.3,0.4-5-1.5-6.9c-2-2-5-2.4-7.4-1.3L9,6L6,9L1.6,4.7C0.4,7.1,0.9,10.1,2.9,12.1c1.9,1.9,4.6,2.4,6.9,1.5l9.1,9.1c0.4,0.4,1,0.4,1.4,0l2.3-2.3C23.1,20,23.1,19.4,22.7,19z',
  // people
  Community: 'M16,11c1.66,0,2.99-1.34,2.99-3S17.66,5,16,5c-1.66,0-3,1.34-3,3S14.34,11,16,11z M8,11c1.66,0,2.99-1.34,2.99-3S9.66,5,8,5C6.34,5,5,6.34,5,8S6.34,11,8,11z M8,13c-2.33,0-7,1.17-7,3.5V19h14v-2.5C15,14.17,10.33,13,8,13z M16,13c-0.29,0-0.62,0.02-0.97,0.05c1.16,0.84,1.97,1.97,1.97,3.45V19h6v-2.5C23,14.17,18.33,13,16,13z',
  // medical cross
  Healthcare: 'M10,2h4v8h8v4h-8v8h-4v-8H2v-4h8V2z',
};

// A badge-style marker: coloured circle with the category glyph, small tail
// pointing at the location. Rainbow-owned/managed places get the biggest
// badge with a gold ring; allies the smallest, slightly faded — the
// community's own places should always stand out first.
export const getMarkerSvgUri = (category: string | null, lgbtStatus: string | null): string => {
  const fill = getCategoryColor(category);
  const glyph = CATEGORY_GLYPHS[category ?? ''] ?? 'M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z';
  const isRainbow = lgbtStatus === 'lgbt_owned' || lgbtStatus === 'lgbt_managed';
  const isAlly = lgbtStatus === 'ally';
  const stroke = isRainbow ? '#FBBF24' : '#FFFFFF';
  const strokeWidth = isRainbow ? 3 : 2;
  const opacity = isAlly ? 0.72 : 1;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 48">` +
    `<g opacity="${opacity}">` +
    `<path d="M20 46 L12.5 30.5 h15 Z" fill="${fill}"/>` +
    `<circle cx="20" cy="18" r="14.5" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>` +
    `<g transform="translate(10.4,8.4) scale(0.8)"><path d="${glyph}" fill="#FFFFFF"/></g>` +
    `</g></svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
};

export const getMarkerIcon = (category: string | null, lgbtStatus: string | null) => {
  const isRainbow = lgbtStatus === 'lgbt_owned' || lgbtStatus === 'lgbt_managed';
  const isAlly = lgbtStatus === 'ally';
  // 40x48 viewBox scaled per prominence tier
  const w = isRainbow ? 46 : isAlly ? 30 : 37;
  const h = Math.round(w * 1.2);
  return {
    url: getMarkerSvgUri(category, lgbtStatus),
    scaledSize: new google.maps.Size(w, h),
    anchor: new google.maps.Point(w / 2, h),
  };
};
