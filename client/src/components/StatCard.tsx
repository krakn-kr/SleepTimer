import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  testId?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, testId }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl sm:text-4xl font-bold text-foreground" data-testid={testId}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground pt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}
