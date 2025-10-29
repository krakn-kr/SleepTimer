import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'database-2.cf262886o520.eu-north-1.rds.amazonaws.com',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD|| 'Ashok123',
  database: process.env.DB_NAME || 'screenlock',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: {
    
    rejectUnauthorized: true // You might want to set this to true in production and provide proper CA certificates
  }
});

// Test the database connection
pool.connect()
  .then(() => {
    console.log('Successfully connected to PostgreSQL database');
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database:', err.message);
  });

export const db = drizzle(pool, { schema });
