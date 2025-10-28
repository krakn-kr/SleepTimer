import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, Clock } from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, isSameDay, isSameWeek, isSameMonth } from "date-fns";
import type { ScreenLockSession } from "@shared/schema";
import { formatDuration } from "@/lib/utils";

type PeriodType = "week" | "month";

interface TrendData {
  label: string;
  totalSeconds: number;
  averageSeconds: number;
  sessionCount: number;
}

export default function Trends() {
  const [periodType, setPeriodType] = useState<PeriodType>("week");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: sessions = [], isLoading } = useQuery<ScreenLockSession[]>({
    queryKey: ["/api/sessions"],
  });

  const trendData = useMemo(() => {
    if (sessions.length === 0) return [];

    const periodStart = periodType === "week" 
      ? startOfWeek(selectedDate, { weekStartsOn: 0 })
      : startOfMonth(selectedDate);
    
    const periodEnd = periodType === "week"
      ? endOfWeek(selectedDate, { weekStartsOn: 0 })
      : endOfMonth(selectedDate);

    const days = eachDayOfInterval({ start: periodStart, end: periodEnd });
    
    return days.map(day => {
      const daySessions = sessions.filter(s => 
        isSameDay(new Date(s.lockTime), day)
      );

      const totalSeconds = daySessions.reduce((sum, s) => sum + s.durationSeconds, 0);
      const averageSeconds = daySessions.length > 0 
        ? Math.round(totalSeconds / daySessions.length)
        : 0;

      return {
        label: format(day, "MMM dd"),
        totalSeconds,
        averageSeconds,
        sessionCount: daySessions.length,
      };
    });
  }, [sessions, periodType, selectedDate]);

  const periodStats = useMemo(() => {
    const totalSeconds = trendData.reduce((sum, d) => sum + d.totalSeconds, 0);
    const totalSessions = trendData.reduce((sum, d) => sum + d.sessionCount, 0);
    const avgPerDay = trendData.length > 0 ? Math.round(totalSeconds / trendData.length) : 0;
    const avgSessionDuration = totalSessions > 0 ? Math.round(totalSeconds / totalSessions) : 0;

    return {
      totalSeconds,
      totalSessions,
      avgPerDay,
      avgSessionDuration,
    };
  }, [trendData]);

  const maxValue = Math.max(...trendData.map(d => d.totalSeconds), 1);

  const navigatePeriod = (direction: "prev" | "next") => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      if (periodType === "week") {
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
      } else {
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
      }
      return newDate;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 w-64 bg-muted animate-pulse rounded-md" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-muted animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Trend Analysis
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            View patterns and trends over time
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={periodType === "week" ? "default" : "outline"}
            onClick={() => setPeriodType("week")}
            data-testid="button-period-week"
          >
            Week
          </Button>
          <Button
            variant={periodType === "month" ? "default" : "outline"}
            onClick={() => setPeriodType("month")}
            data-testid="button-period-month"
          >
            Month
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigatePeriod("prev")}
          data-testid="button-prev-period"
        >
          Previous
        </Button>
        <div className="flex items-center gap-2 text-foreground font-medium">
          <Calendar className="h-4 w-4" />
          {periodType === "week" ? (
            <>
              {format(startOfWeek(selectedDate, { weekStartsOn: 0 }), "MMM dd")} -{" "}
              {format(endOfWeek(selectedDate, { weekStartsOn: 0 }), "MMM dd, yyyy")}
            </>
          ) : (
            format(selectedDate, "MMMM yyyy")
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => navigatePeriod("next")}
          data-testid="button-next-period"
        >
          Next
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Total Time
              </p>
              <p className="text-3xl font-bold text-foreground" data-testid="stat-period-total">
                {formatDuration(periodStats.totalSeconds)}
              </p>
            </div>
            <Clock className="h-6 w-6 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Avg Per Day
              </p>
              <p className="text-3xl font-bold text-foreground" data-testid="stat-period-avg-day">
                {formatDuration(periodStats.avgPerDay)}
              </p>
            </div>
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Total Sessions
              </p>
              <p className="text-3xl font-bold text-foreground" data-testid="stat-period-sessions">
                {periodStats.totalSessions}
              </p>
            </div>
            <Calendar className="h-6 w-6 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Avg Session
              </p>
              <p className="text-3xl font-bold text-foreground" data-testid="stat-period-avg-session">
                {formatDuration(periodStats.avgSessionDuration)}
              </p>
            </div>
            <Clock className="h-6 w-6 text-primary" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Daily Screen Lock Time
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Total lock duration per day in this {periodType}
            </p>
          </div>

          {trendData.every(d => d.totalSeconds === 0) ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No data for this period</p>
              <p className="text-xs text-muted-foreground mt-1">
                Select a different time period to view trends
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {trendData.map((item, index) => {
                const percentage = (item.totalSeconds / maxValue) * 100;
                return (
                  <div key={index} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4 min-w-[120px]">
                        <span className="font-medium text-muted-foreground w-16">
                          {item.label}
                        </span>
                        <span className="text-muted-foreground">
                          {item.sessionCount} {item.sessionCount === 1 ? "session" : "sessions"}
                        </span>
                      </div>
                      <span className="font-semibold text-foreground">
                        {formatDuration(item.totalSeconds)}
                      </span>
                    </div>
                    <div className="relative h-6 w-full overflow-hidden rounded-md bg-muted">
                      <div
                        className="h-full rounded-md transition-all duration-500 bg-primary"
                        style={{ width: `${Math.max(percentage, 2)}%` }}
                        title={`${formatDuration(item.totalSeconds)} total`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
