import { Card } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";

interface BarChartData {
  id: string;
  label: string;
  value: number;
  durationSeconds: number;
}

interface BarChartProps {
  title: string;
  data: BarChartData[];
  reversed?: boolean;
  testId?: string;
}

export function BarChart({ title, data, reversed = false, testId }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  const getBarColor = (index: number, total: number) => {
    if (reversed) {
      const intensity = 5 - Math.floor((index / total) * 4);
      return `bg-chart-${intensity as 1 | 2 | 3 | 4 | 5}`;
    }
    const intensity = Math.floor((index / total) * 4) + 1;
    return `bg-chart-${intensity as 1 | 2 | 3 | 4 | 5}`;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground" data-testid={testId}>
            {title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {reversed ? "Shortest to longest durations" : "Longest to shortest durations"}
          </p>
        </div>

        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">No data available</p>
            <p className="text-xs text-muted-foreground mt-1">
              Screen lock data will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((item, index) => {
              const percentage = (item.value / maxValue) * 100;
              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-muted-foreground">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-semibold text-foreground" data-testid={`duration-${item.id}`}>
                      {formatDuration(item.durationSeconds)}
                    </span>
                  </div>
                  <div className="relative h-8 w-full overflow-hidden rounded-r-md bg-muted">
                    <div
                      className={`h-full rounded-r-md transition-all duration-500 ${getBarColor(index, data.length)}`}
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                      title={`${formatDuration(item.durationSeconds)} lock duration`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
