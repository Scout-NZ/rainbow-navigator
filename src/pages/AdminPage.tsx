
import { CSVImporter } from "@/components/admin/CSVImporter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold rainbow-text">Admin Dashboard</h1>
      </div>
      
      <p className="text-muted-foreground">
        Use this dashboard to manage application data and settings.
      </p>
      
      <Alert variant="default" className="border-l-4 border-l-amber-500">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>CSV Importer</AlertTitle>
        <AlertDescription>
          Use the importer below to upload your CSV files containing location data.
          <strong className="block mt-2">Note: </strong> 
          The application currently has Row Level Security (RLS) policies enabled on the locations table. 
          The upload will preview locations, but you may need to disable RLS or configure proper permissions 
          in Supabase to complete the actual import.
        </AlertDescription>
      </Alert>
      
      <div className="mt-6">
        <CSVImporter />
      </div>
    </div>
  );
}
