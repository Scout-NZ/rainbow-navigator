
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Make the Google Maps API key available globally
window.VITE_GOOGLE_MAPS_API_KEY = 'AIzaSyDK3hZtsdLtb8zsTT5mzzdDCC8Nj5O2wyQ';

createRoot(document.getElementById("root")!).render(<App />);
