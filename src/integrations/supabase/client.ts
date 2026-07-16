import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Values can be overridden per-environment via Vite env vars (see .env.example).
// The publishable (anon) key is safe to expose — data access is controlled by
// Row Level Security policies in the database.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://wpzjeodswvbneylbkwid.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_kp6WLDXRQQPdaPWbXVR8TQ_cXFwHAnC";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
