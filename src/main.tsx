
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log environment variables for debugging
console.log("Environment:", {
  BASE_PATH: import.meta.env.VITE_BASE_PATH || '/',
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Set (value hidden)' : 'Not set'
});

// Make sure Google Maps API key is available
if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
  console.warn("WARNING: VITE_GOOGLE_MAPS_API_KEY environment variable is not set. Using fallback key.");
}

createRoot(document.getElementById("root")!).render(<App />);
