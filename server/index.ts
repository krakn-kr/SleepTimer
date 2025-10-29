import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { db } from "./db";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

app.use(cors());
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Test database connection
async function testDbConnection() {
  try {
    await db.query.users.findMany();
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
  return true;
}

async function initializeServer() {
  const dbConnected = await testDbConnection();
  if (!dbConnected) {
    console.error('Failed to connect to database');
    return;
  }

  await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error('Error:', err);
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });

  const port = process.env.PORT || 5000;
  if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}

initializeServer();

export default app;