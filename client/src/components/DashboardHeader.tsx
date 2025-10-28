import { Smartphone } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { AddSessionDialog } from "./AddSessionDialog";
import { ImportDialog } from "./ImportDialog";
import { ExportDialog } from "./ExportDialog";
import { useQuery } from "@tanstack/react-query";
import type { ScreenLockSession } from "@shared/schema";

export function DashboardHeader() {
  const { data: sessions = [] } = useQuery<ScreenLockSession[]>({
    queryKey: ["/api/sessions"],
  });

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Smartphone className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-foreground" data-testid="text-app-title">
                Screen Time Analytics
              </h1>
              <p className="text-xs text-muted-foreground">
                Monitor your device usage patterns
              </p>
            </div>
            <h1 className="md:hidden text-lg font-bold text-foreground" data-testid="text-app-title-mobile">
              Screen Time
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ExportDialog sessions={sessions} />
            <ImportDialog />
            <AddSessionDialog />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
