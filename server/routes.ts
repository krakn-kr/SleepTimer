import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScreenLockSessionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/sessions", async (_req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      res.json(sessions);
    } catch (error) {
      console.error('GET /api/sessions error:', error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const validated = insertScreenLockSessionSchema.parse({
        ...req.body,
        lockTime: new Date(req.body.lockTime),
        unlockTime: new Date(req.body.unlockTime),
      });
      
      const session = await storage.createSession(validated);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  app.post("/api/sessions/import", async (req, res) => {
    try {
      const { sessions } = req.body;
      
      if (!Array.isArray(sessions)) {
        return res.status(400).json({ error: "Sessions must be an array" });
      }

      const results = {
        success: 0,
        failed: 0,
        total: sessions.length,
        errors: [] as string[],
      };

      for (const sessionData of sessions) {
        try {
          const validated = insertScreenLockSessionSchema.parse({
            lockTime: new Date(sessionData.lockTime),
            unlockTime: new Date(sessionData.unlockTime),
          });
          
          await storage.createSession(validated);
          results.success++;
        } catch (error) {
          results.failed++;
          results.errors.push(
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      }

      res.json(results);
    } catch (error) {
      res.status(400).json({ error: "Invalid import data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
