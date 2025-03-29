
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";

type LocationInsert = Database['public']['Tables']['locations']['Insert'];

export const parseCSV = (csvContent: string): LocationInsert[] => {
  const lines = csvContent.split('\n');
  
  // Get headers and remove quotes if they exist
  const headers = lines[0].split(',').map(header => 
    header.trim().replace(/^"(.*)"$/, '$1')
  );
  
  const locations: LocationInsert[] = [];
  
  // Start from index 1 to skip header row
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines
    
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) {
      console.warn(`Line ${i+1} has ${values.length} values, expected ${headers.length}`);
      continue;
    }
    
    const location: Record<string, any> = {};
    
    // Map CSV fields to database fields
    headers.forEach((header, index) => {
      // Handle special fields
      if (header.toLowerCase() === 'tags' && values[index]) {
        // Convert comma-separated tags to array
        location[header] = values[index].split(';').map((tag: string) => tag.trim());
      } else if (header.toLowerCase() === 'lat' || header.toLowerCase() === 'lng') {
        // Convert coordinates to numbers
        location[header] = values[index] ? parseFloat(values[index]) : null;
      } else if (header.toLowerCase() === 'verified') {
        // Convert verified to boolean
        location[header] = values[index]?.toLowerCase() === 'true';
      } else {
        location[header] = values[index] || null;
      }
    });
    
    // Ensure required fields have values
    if (!location.name || !location.type || !location.category) {
      console.warn(`Line ${i+1} is missing required fields`);
      continue;
    }
    
    locations.push(location as LocationInsert);
  }
  
  return locations;
};

// Helper function to correctly parse CSV lines, handling quoted values
const parseCSVLine = (line: string): string[] => {
  const values: string[] = [];
  let currentValue = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      values.push(currentValue.trim().replace(/^"(.*)"$/, '$1'));
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  values.push(currentValue.trim().replace(/^"(.*)"$/, '$1'));
  return values;
};

export const importLocations = async (locations: LocationInsert[]): Promise<{success: number, errors: number}> => {
  let success = 0;
  let errors = 0;
  
  // Process in batches to avoid hitting size limits
  const batchSize = 20;
  for (let i = 0; i < locations.length; i += batchSize) {
    const batch = locations.slice(i, i + batchSize);
    
    try {
      // First try with standard authentication
      const { error } = await supabase
        .from('locations')
        .insert(batch);
      
      if (error) {
        console.error('Error importing batch:', error);
        
        // If we have RLS policy error (code 42501), inform the user
        if (error.code === '42501') {
          toast({
            title: "Authentication Required",
            description: "You need to sign in with an account that has permissions to import data.",
            variant: "destructive"
          });
          
          // Return early as all subsequent batches will also fail
          return { success: 0, errors: locations.length };
        } else if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
          // JWT expired or not authenticated
          toast({
            title: "Authentication Required",
            description: "Please sign in to import data. Your session may have expired.",
            variant: "destructive"
          });
          
          return { success: 0, errors: locations.length };
        }
        
        errors += batch.length;
      } else {
        success += batch.length;
      }
    } catch (error) {
      console.error('Exception during import:', error);
      errors += batch.length;
    }
  }
  
  return { success, errors };
};
