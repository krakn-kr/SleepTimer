import { screenLockSessions } from "@shared/schema";
import { db } from "./db";
import { desc } from "drizzle-orm";
export class DatabaseStorage {
    async getAllSessions() {
        try {
            const sessions = await db
                .select()
                .from(screenLockSessions)
                .orderBy(desc(screenLockSessions.lockTime));
            return sessions;
        }
        catch (error) {
            console.error('Error in getAllSessions:', error);
            throw error;
        }
    }
    async createSession(insertSession) {
        const durationSeconds = Math.floor((insertSession.unlockTime.getTime() - insertSession.lockTime.getTime()) / 1000);
        const [session] = await db
            .insert(screenLockSessions)
            .values({
            ...insertSession,
            durationSeconds,
        })
            .returning();
        return session;
    }
    async deleteSessions(ids) {
        if (ids.length === 0)
            return;
        const { inArray } = await import("drizzle-orm");
        await db
            .delete(screenLockSessions)
            .where(inArray(screenLockSessions.id, ids));
    }
}
export const storage = new DatabaseStorage();
