
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { parseCSV, importLocations } from "@/utils/csvImport";
import { toast } from "@/components/ui/use-toast";
import { FileText, Upload, AlertCircle, CheckCircle2, ShieldAlert, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database } from "@/integrations/supabase/types";

type LocationInsert = Database['public']['Tables']['locations']['Insert'];

export function CSVImporter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [allLocations, setAllLocations] = useState<LocationInsert[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{success: number, errors: number} | null>(null);
  const [permissionError, setPermissionError] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setPreview([]);
    setAllLocations([]);
    setResult(null);
    setPermissionError(false);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        try {
          const parsed = parseCSV(content);
          setPreview(parsed.slice(0, 5)); // Show first 5 items as preview
          setAllLocations(parsed); // Keep all locations for potential export
        } catch (error) {
          console.error("Error parsing CSV:", error);
          toast({
            title: "Error parsing CSV",
            description: "The file format is invalid. Please check your CSV file.",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(selectedFile);
    }
  };
  
  const handleImport = async () => {
    if (!file) return;
    
    setImporting(true);
    setProgress(0);
    setResult(null);
    setPermissionError(false);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        const locations = parseCSV(content);
        
        setProgress(10);
        
        if (locations.length === 0) {
          toast({
            title: "No valid locations found",
            description: "No valid locations were found in the CSV file.",
            variant: "destructive"
          });
          setImporting(false);
          return;
        }
        
        toast({
          title: "Import started",
          description: `Importing ${locations.length} locations...`,
        });
        
        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress(prev => Math.min(prev + 5, 90));
        }, 200);
        
        const result = await importLocations(locations);
        
        clearInterval(progressInterval);
        setProgress(100);
        setResult(result);
        
        // Check if we have a permission error (all records failed)
        if (result.errors === locations.length && result.success === 0) {
          setPermissionError(true);
          toast({
            title: "Permission denied",
            description: "You don't have permission to import locations. The data is available for preview or export.",
            variant: "default"
          });
        } else if (result.success > 0) {
          toast({
            title: "Import completed",
            description: `Successfully imported ${result.success} locations.${result.errors > 0 ? ` Failed to import ${result.errors} locations.` : ''}`,
            variant: result.errors > 0 ? "default" : "default"
          });
        } else {
          toast({
            title: "Import failed",
            description: "Failed to import any locations. The data is available for preview or export.",
            variant: "default"
          });
        }
        
        setImporting(false);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error during import:", error);
      toast({
        title: "Import failed",
        description: "An error occurred during the import process.",
        variant: "destructive"
      });
      setImporting(false);
    }
  };
  
  const handleExportJSON = () => {
    if (allLocations.length === 0) return;
    
    const dataStr = JSON.stringify(allLocations, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'locations.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export completed",
      description: `Successfully exported ${allLocations.length} locations as JSON.`,
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import Locations</CardTitle>
        <CardDescription>
          Upload a CSV file containing location data to import into the database.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {permissionError && (
            <Alert variant="default" className="border-l-4 border-l-blue-500">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Permission Notice</AlertTitle>
              <AlertDescription>
                Your account doesn't have permission to import data into the locations table due to Row Level Security (RLS) policies. 
                The data has been parsed and is available for preview or export. You can still use the JSON export feature below.
              </AlertDescription>
            </Alert>
          )}
        
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={importing}
              id="csv-file"
              className="cursor-pointer"
            />
          </div>
          
          {importing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Importing...</p>
                <p className="text-sm text-muted-foreground">{progress}%</p>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {result && !permissionError && (
            <Alert variant={result.errors > 0 ? "default" : "default"} className="border-l-4 border-l-primary">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Import Completed</AlertTitle>
              <AlertDescription>
                Successfully imported {result.success} locations.
                {result.errors > 0 && ` Failed to import ${result.errors} locations.`}
              </AlertDescription>
            </Alert>
          )}
          
          {allLocations.length > 0 && (
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={handleExportJSON}
                className="gap-2"
              >
                Export as JSON
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {preview.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Preview (first 5 entries)</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>City</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.city}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-muted-foreground">
                {preview.length === 5 && allLocations.length > 5 
                  ? `Showing first 5 entries of ${allLocations.length} from your CSV file.` 
                  : "Preview of all entries from your CSV file."}
              </p>
            </div>
          )}
          
          {!preview.length && file && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Invalid CSV Format</AlertTitle>
              <AlertDescription>
                No valid data could be extracted from the CSV file. Please check the file format.
              </AlertDescription>
            </Alert>
          )}
          
          {!file && (
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md">
              <FileText className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                Select a CSV file to import locations. The file should have headers matching the database fields.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => {
          setFile(null);
          setPreview([]);
          setAllLocations([]);
          setResult(null);
          setPermissionError(false);
        }} disabled={importing || !file}>
          Clear
        </Button>
        <Button 
          onClick={handleImport} 
          disabled={importing || !file || preview.length === 0}
          className="gap-2"
        >
          {importing ? "Importing..." : "Import Locations"}
          <Upload className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
