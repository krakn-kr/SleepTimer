import { db } from "./db";
import { screenLockSessions } from "@shared/schema";

async function seed() {
  console.log("Seeding database with sample data...");

  const now = new Date();
  const mockSessions: Array<{
    daysAgo: number;
    lockHour: number;
    lockMinute: number;
    durationSeconds: number;
  }> = [
    // Today's sessions
    { daysAgo: 0, lockHour: 2, lockMinute: 30, durationSeconds: 25200 },
    { daysAgo: 0, lockHour: 10, lockMinute: 15, durationSeconds: 120 },
    { daysAgo: 0, lockHour: 12, lockMinute: 45, durationSeconds: 1800 },
    { daysAgo: 0, lockHour: 14, lockMinute: 20, durationSeconds: 45 },
    { daysAgo: 0, lockHour: 16, lockMinute: 0, durationSeconds: 3600 },
    { daysAgo: 0, lockHour: 18, lockMinute: 30, durationSeconds: 300 },
    { daysAgo: 0, lockHour: 20, lockMinute: 15, durationSeconds: 7200 },
    
    // Yesterday's sessions
    { daysAgo: 1, lockHour: 1, lockMinute: 0, durationSeconds: 21600 },
    { daysAgo: 1, lockHour: 8, lockMinute: 30, durationSeconds: 90 },
    { daysAgo: 1, lockHour: 11, lockMinute: 0, durationSeconds: 2400 },
    { daysAgo: 1, lockHour: 13, lockMinute: 30, durationSeconds: 600 },
    { daysAgo: 1, lockHour: 15, lockMinute: 45, durationSeconds: 30 },
    { daysAgo: 1, lockHour: 17, lockMinute: 20, durationSeconds: 4500 },
    { daysAgo: 1, lockHour: 19, lockMinute: 0, durationSeconds: 150 },
    { daysAgo: 1, lockHour: 22, lockMinute: 30, durationSeconds: 9000 },
    
    // 2 days ago
    { daysAgo: 2, lockHour: 0, lockMinute: 45, durationSeconds: 28800 },
    { daysAgo: 2, lockHour: 10, lockMinute: 0, durationSeconds: 180 },
    { daysAgo: 2, lockHour: 12, lockMinute: 30, durationSeconds: 1200 },
    { daysAgo: 2, lockHour: 14, lockMinute: 15, durationSeconds: 60 },
    { daysAgo: 2, lockHour: 16, lockMinute: 45, durationSeconds: 5400 },
    { daysAgo: 2, lockHour: 19, lockMinute: 30, durationSeconds: 240 },
    { daysAgo: 2, lockHour: 21, lockMinute: 0, durationSeconds: 3300 },
    
    // 3 days ago
    { daysAgo: 3, lockHour: 1, lockMinute: 30, durationSeconds: 23400 },
    { daysAgo: 3, lockHour: 9, lockMinute: 0, durationSeconds: 15 },
    { daysAgo: 3, lockHour: 11, lockMinute: 45, durationSeconds: 900 },
    { daysAgo: 3, lockHour: 14, lockMinute: 0, durationSeconds: 2700 },
    { daysAgo: 3, lockHour: 16, lockMinute: 30, durationSeconds: 20 },
    { daysAgo: 3, lockHour: 18, lockMinute: 15, durationSeconds: 6300 },
    { daysAgo: 3, lockHour: 20, lockMinute: 45, durationSeconds: 420 },
    
    // 4 days ago
    { daysAgo: 4, lockHour: 2, lockMinute: 0, durationSeconds: 19800 },
    { daysAgo: 4, lockHour: 10, lockMinute: 30, durationSeconds: 25 },
    { daysAgo: 4, lockHour: 13, lockMinute: 0, durationSeconds: 3000 },
    { daysAgo: 4, lockHour: 15, lockMinute: 15, durationSeconds: 450 },
    { daysAgo: 4, lockHour: 17, lockMinute: 45, durationSeconds: 7200 },
    { daysAgo: 4, lockHour: 20, lockMinute: 0, durationSeconds: 1500 },
    
    // 5 days ago
    { daysAgo: 5, lockHour: 1, lockMinute: 15, durationSeconds: 27000 },
    { daysAgo: 5, lockHour: 11, lockMinute: 0, durationSeconds: 360 },
    { daysAgo: 5, lockHour: 14, lockMinute: 30, durationSeconds: 1800 },
    { daysAgo: 5, lockHour: 17, lockMinute: 0, durationSeconds: 5400 },
    { daysAgo: 5, lockHour: 19, lockMinute: 45, durationSeconds: 40 },
    { daysAgo: 5, lockHour: 22, lockMinute: 0, durationSeconds: 4800 },
    
    // 6 days ago
    { daysAgo: 6, lockHour: 0, lockMinute: 30, durationSeconds: 24300 },
    { daysAgo: 6, lockHour: 9, lockMinute: 45, durationSeconds: 200 },
    { daysAgo: 6, lockHour: 12, lockMinute: 15, durationSeconds: 2100 },
    { daysAgo: 6, lockHour: 15, lockMinute: 0, durationSeconds: 90 },
    { daysAgo: 6, lockHour: 18, lockMinute: 30, durationSeconds: 8100 },
    { daysAgo: 6, lockHour: 21, lockMinute: 15, durationSeconds: 600 },
  ];

  const sessions = mockSessions.map((session) => {
    const lockTime = new Date(now);
    lockTime.setDate(lockTime.getDate() - session.daysAgo);
    lockTime.setHours(session.lockHour, session.lockMinute, 0, 0);

    const unlockTime = new Date(
      lockTime.getTime() + session.durationSeconds * 1000
    );

    return {
      lockTime,
      unlockTime,
      durationSeconds: session.durationSeconds,
    };
  });

  await db.insert(screenLockSessions).values(sessions);
  
  console.log(`✓ Seeded ${sessions.length} sessions`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
