import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/StatCard";
import { BarChart } from "@/components/BarChart";
import { DateFilter } from "@/components/DateFilter";
import { Clock, TrendingUp, Lock, Timer } from "lucide-react";
import { formatDuration, formatDetailedDuration } from "@/lib/utils";
import { format, subDays, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import type { ScreenLockSession, DailyStats } from "@shared/schema";

export default function Dashboard() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [selectedDate, setSelectedDate] = useState(today);

  const { data: sessions = [], isLoading, isError } = useQuery<ScreenLockSession[]>({
    queryKey: ["/api/sessions"],
  });

  const availableDates = Array.from(
    new Set(
      sessions.map((s) => format(new Date(s.lockTime), "yyyy-MM-dd"))
    )
  ).sort((a, b) => b.localeCompare(a));

  const getFilteredSessions = () => {
    if (selectedDate === "last-7-days") {
      const sevenDaysAgo = subDays(new Date(), 7);
      return sessions.filter((s) =>
        isAfter(new Date(s.lockTime), sevenDaysAgo)
      );
    }

    const dateStart = startOfDay(new Date(selectedDate));
    const dateEnd = endOfDay(new Date(selectedDate));

    return sessions.filter((s) => {
      const sessionDate = new Date(s.lockTime);
      return !isBefore(sessionDate, dateStart) && !isAfter(sessionDate, dateEnd);
    });
  };

  const filteredSessions = getFilteredSessions();

  const stats: DailyStats = {
    date: selectedDate,
    totalLockTimeSeconds: filteredSessions.reduce((sum, s) => sum + s.durationSeconds, 0),
    averageDurationSeconds: filteredSessions.length
      ? Math.round(
          filteredSessions.reduce((sum, s) => sum + s.durationSeconds, 0) /
            filteredSessions.length
        )
      : 0,
    sessionCount: filteredSessions.length,
    longestSessionSeconds: filteredSessions.length
      ? Math.max(...filteredSessions.map((s) => s.durationSeconds))
      : 0,
  };

  const sortedByLongest = [...filteredSessions]
    .sort((a, b) => b.durationSeconds - a.durationSeconds)
    .slice(0, 10)
    .map((session, index) => ({
      id: session.id,
      label: `Session ${index + 1}`,
      value: session.durationSeconds,
      durationSeconds: session.durationSeconds,
    }));

  const sortedByShortest = [...filteredSessions]
    .sort((a, b) => a.durationSeconds - b.durationSeconds)
    .slice(0, 10)
    .map((session, index) => ({
      id: session.id,
      label: `Session ${index + 1}`,
      value: session.durationSeconds,
      durationSeconds: session.durationSeconds,
    }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-96 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="rounded-full bg-destructive/10 p-6 mb-4">
          <svg
            className="h-12 w-12 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Failed to Load Data</h2>
        <p className="text-muted-foreground max-w-md">
          Unable to retrieve screen lock session data. Please refresh the page or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Analytics Overview
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track and analyze your screen lock patterns
          </p>
        </div>
        <DateFilter
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          availableDates={availableDates}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Lock Time"
          value={formatDuration(stats.totalLockTimeSeconds)}
          subtitle={formatDetailedDuration(stats.totalLockTimeSeconds)}
          icon={Clock}
          testId="stat-total-lock-time"
        />
        <StatCard
          title="Average Duration"
          value={formatDuration(stats.averageDurationSeconds)}
          subtitle={`Per session average`}
          icon={TrendingUp}
          testId="stat-average-duration"
        />
        <StatCard
          title="Total Sessions"
          value={stats.sessionCount.toString()}
          subtitle={`Lock/unlock cycles`}
          icon={Lock}
          testId="stat-total-sessions"
        />
        <StatCard
          title="Longest Session"
          value={formatDuration(stats.longestSessionSeconds)}
          subtitle={`Maximum lock duration`}
          icon={Timer}
          testId="stat-longest-session"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BarChart
          title="Top 10 Longest Lock Sessions"
          data={sortedByLongest}
          testId="chart-longest-sessions"
        />
        <BarChart
          title="Top 10 Shortest Lock Sessions"
          data={sortedByShortest}
          reversed
          testId="chart-shortest-sessions"
        />
      </div>

      <div className="text-center text-xs text-muted-foreground py-4">
        Last updated: {format(new Date(), "MMM dd, yyyy 'at' h:mm a")}
      </div>
    </div>
  );
}
