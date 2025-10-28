import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ScreenLockSession } from "@shared/schema";

interface ImportResult {
  success: number;
  failed: number;
  total: number;
  errors?: string[];
}

export function ImportDialog() {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const importMutation = useMutation({
    mutationFn: async (file: File): Promise<ImportResult> => {
      const text = await file.text();
      let sessions: Array<{ lockTime: string; unlockTime: string }>;

      if (file.name.endsWith('.json')) {
        sessions = JSON.parse(text);
      } else {
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        
        if (!headers.includes('lockTime') || !headers.includes('unlockTime')) {
          throw new Error('CSV must have lockTime and unlockTime columns');
        }

        sessions = lines.slice(1).map(line => {
          const values = line.split(',');
          const lockTimeIdx = headers.indexOf('lockTime');
          const unlockTimeIdx = headers.indexOf('unlockTime');
          
          return {
            lockTime: values[lockTimeIdx].trim(),
            unlockTime: values[unlockTimeIdx].trim(),
          };
        });
      }

      const response = await apiRequest("POST", "/api/sessions/import", { sessions });
      return response.json();
    },
    onSuccess: (result: ImportResult) => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      setImportResult(result);
      
      if (result.success > 0) {
        toast({
          title: "Import successful",
          description: `Successfully imported ${result.success} of ${result.total} sessions.`,
        });
      }
      
      if (result.failed > 0) {
        toast({
          title: "Some imports failed",
          description: `${result.failed} sessions could not be imported.`,
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Import failed",
        description: error.message || "Failed to import sessions. Please check your file format.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImportResult(null);
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      importMutation.mutate(selectedFile);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => isOpen ? setOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        <Button variant="outline" data-testid="button-import">
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Import Sessions</DialogTitle>
          <DialogDescription>
            Upload a CSV or JSON file containing screen lock session data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                data-testid="input-file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="p-3 rounded-full bg-muted">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Click to upload file</p>
                    <p className="text-sm text-muted-foreground">CSV or JSON format</p>
                  </div>
                )}
              </label>
            </div>

            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <p className="text-sm font-medium">Expected formats:</p>
              <div className="space-y-1 text-xs text-muted-foreground font-mono">
                <p>CSV: lockTime,unlockTime</p>
                <p className="ml-8">2024-01-01T10:00,2024-01-01T11:00</p>
                <p className="mt-2">JSON: [&#123;"lockTime": "2024-01-01T10:00", "unlockTime": "2024-01-01T11:00"&#125;]</p>
              </div>
            </div>
          </div>

          {importResult && (
            <div className={`rounded-lg p-4 ${importResult.failed === 0 ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
              <div className="flex items-start gap-3">
                {importResult.failed === 0 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                )}
                <div className="flex-1 space-y-1">
                  <p className="font-medium">Import Results</p>
                  <p className="text-sm text-muted-foreground">
                    {importResult.success} of {importResult.total} sessions imported successfully
                  </p>
                  {importResult.failed > 0 && importResult.errors && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-medium">Errors:</p>
                      {importResult.errors.slice(0, 3).map((error, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground">• {error}</p>
                      ))}
                      {importResult.errors.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          ...and {importResult.errors.length - 3} more
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              data-testid="button-cancel-import"
            >
              {importResult ? "Close" : "Cancel"}
            </Button>
            {!importResult && (
              <Button
                onClick={handleImport}
                disabled={!selectedFile || importMutation.isPending}
                data-testid="button-submit-import"
              >
                {importMutation.isPending ? "Importing..." : "Import"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
