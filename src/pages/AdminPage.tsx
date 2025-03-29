
import { CSVImporter } from "@/components/admin/CSVImporter";

export default function AdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold rainbow-text">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Use this dashboard to manage application data and settings.
      </p>
      
      <div className="mt-6">
        <CSVImporter />
      </div>
    </div>
  );
}
