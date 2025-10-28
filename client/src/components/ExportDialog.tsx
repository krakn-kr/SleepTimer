import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ExportDialogProps {
  sessions: Array<{
    id: string;
    lockTime: Date;
    unlockTime: Date;
    durationSeconds: number;
  }>;
}

export function ExportDialog({ sessions }: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const exportToCSV = () => {
    const headers = "lockTime,unlockTime,durationSeconds,durationFormatted\n";
    const rows = sessions.map(session => {
      const lockTime = format(new Date(session.lockTime), "yyyy-MM-dd'T'HH:mm:ss");
      const unlockTime = format(new Date(session.unlockTime), "yyyy-MM-dd'T'HH:mm:ss");
      const hours = Math.floor(session.durationSeconds / 3600);
      const minutes = Math.floor((session.durationSeconds % 3600) / 60);
      const durationFormatted = `${hours}h ${minutes}m`;
      
      return `${lockTime},${unlockTime},${session.durationSeconds},${durationFormatted}`;
    }).join("\n");

    const csv = headers + rows;
    downloadFile(csv, `screen-time-export-${format(new Date(), "yyyy-MM-dd")}.csv`, "text/csv");
    
    toast({
      title: "Export successful",
      description: `Exported ${sessions.length} sessions to CSV.`,
    });
  };

  const exportToJSON = () => {
    const data = sessions.map(session => ({
      lockTime: format(new Date(session.lockTime), "yyyy-MM-dd'T'HH:mm:ss"),
      unlockTime: format(new Date(session.unlockTime), "yyyy-MM-dd'T'HH:mm:ss"),
      durationSeconds: session.durationSeconds,
    }));

    const json = JSON.stringify(data, null, 2);
    downloadFile(json, `screen-time-export-${format(new Date(), "yyyy-MM-dd")}.json`, "application/json");
    
    toast({
      title: "Export successful",
      description: `Exported ${sessions.length} sessions to JSON.`,
    });
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" data-testid="button-export">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Download your screen lock session data in CSV or JSON format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-3">
              <FileText className="h-10 w-10 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-foreground">CSV Format</p>
                <p className="text-sm text-muted-foreground">
                  Compatible with Excel and spreadsheet apps
                </p>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                exportToCSV();
                setOpen(false);
              }}
              disabled={sessions.length === 0}
              data-testid="button-export-csv"
            >
              <Download className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
          </div>

          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-3">
              <FileText className="h-10 w-10 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-foreground">JSON Format</p>
                <p className="text-sm text-muted-foreground">
                  Structured data for developers and APIs
                </p>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                exportToJSON();
                setOpen(false);
              }}
              disabled={sessions.length === 0}
              data-testid="button-export-json"
            >
              <Download className="h-4 w-4 mr-2" />
              Export as JSON
            </Button>
          </div>

          {sessions.length === 0 && (
            <p className="text-sm text-center text-muted-foreground">
              No data available to export
            </p>
          )}

          {sessions.length > 0 && (
            <p className="text-xs text-center text-muted-foreground">
              {sessions.length} session{sessions.length !== 1 ? "s" : ""} ready to export
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
