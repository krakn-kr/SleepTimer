import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const screenLockSessions = pgTable("screen_lock_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lockTime: timestamp("lock_time").notNull(),
  unlockTime: timestamp("unlock_time").notNull(),
  durationSeconds: integer("duration_seconds").notNull(),
});

export const insertScreenLockSessionSchema = createInsertSchema(screenLockSessions).omit({
  id: true,
  durationSeconds: true,
});

export type InsertScreenLockSession = z.infer<typeof insertScreenLockSessionSchema>;
export type ScreenLockSession = typeof screenLockSessions.$inferSelect;

export interface DailyStats {
  date: string;
  totalLockTimeSeconds: number;
  averageDurationSeconds: number;
  sessionCount: number;
  longestSessionSeconds: number;
}
