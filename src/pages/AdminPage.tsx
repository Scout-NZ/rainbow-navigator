
import { CSVImporter } from "@/components/admin/CSVImporter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold rainbow-text">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Use this dashboard to manage application data and settings.
      </p>
      
      <Alert variant="default" className="border-l-4 border-l-amber-500">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Supabase Permissions Required</AlertTitle>
        <AlertDescription>
          To import data, you need to either be logged in with an account that has admin permissions, 
          or have Row Level Security (RLS) policies configured for the locations table.
          Contact your Supabase administrator to set up the appropriate permissions.
        </AlertDescription>
      </Alert>
      
      <div className="mt-6">
        <CSVImporter />
      </div>
    </div>
  );
}
