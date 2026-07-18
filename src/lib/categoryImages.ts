// One curated, category-appropriate image per place category.
// Used as the fallback wherever a place has no photo of its own, so a
// healthcare clinic never shows a random unrelated stock image.

const IMG_PARAMS = "?auto=format&fit=crop&w=800&q=80";

const CATEGORY_IMAGES: Record<string, string> = {
  // Espresso machine / café counter
  Cafes: `https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb${IMG_PARAMS}`,
  // Bartender mixing a drink
  Bars: `https://images.unsplash.com/photo-1572116469696-31de0f17cc34${IMG_PARAMS}`,
  // Stage lights and crowd
  Nightlife: `https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3${IMG_PARAMS}`,
  // Clothing racks in a boutique
  Shopping: `https://images.unsplash.com/photo-1441986300917-64674bd600d8${IMG_PARAMS}`,
  // Handshake across a desk
  Services: `https://images.unsplash.com/photo-1521791136064-7986c2920216${IMG_PARAMS}`,
  // Clinician with stethoscope and tablet
  Healthcare: `https://images.unsplash.com/photo-1576091160399-112ba8d25d1d${IMG_PARAMS}`,
  // Friends together outdoors
  Community: `https://images.unsplash.com/photo-1529156069898-49953e39b3ac${IMG_PARAMS}`,
};

// Friends image doubles as the neutral default
const DEFAULT_IMAGE = CATEGORY_IMAGES.Community;

export function getCategoryImage(category: string | null | undefined): string {
  if (!category) return DEFAULT_IMAGE;
  return CATEGORY_IMAGES[category] || DEFAULT_IMAGE;
}
