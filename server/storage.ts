import { screenLockSessions, type ScreenLockSession, type InsertScreenLockSession } from "@shared/schema";
import { db } from "./db";
import { desc } from "drizzle-orm";

export interface IStorage {
  getAllSessions(): Promise<ScreenLockSession[]>;
  createSession(session: InsertScreenLockSession): Promise<ScreenLockSession>;
  deleteSessions(ids: string[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getAllSessions(): Promise<ScreenLockSession[]> {
    try {
      const sessions = await db
        .select()
        .from(screenLockSessions)
        .orderBy(desc(screenLockSessions.lockTime));
      return sessions;
    } catch (error) {
      console.error('Error in getAllSessions:', error);
      throw error;
    }
  }

  async createSession(insertSession: InsertScreenLockSession): Promise<ScreenLockSession> {
    const durationSeconds = Math.floor(
      (insertSession.unlockTime.getTime() - insertSession.lockTime.getTime()) / 1000
    );
    
    const [session] = await db
      .insert(screenLockSessions)
      .values({
        ...insertSession,
        durationSeconds,
      })
      .returning();
    return session;
  }

  async deleteSessions(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    
    const { inArray } = await import("drizzle-orm");
    await db
      .delete(screenLockSessions)
      .where(inArray(screenLockSessions.id, ids));
  }
}

export const storage = new DatabaseStorage();
