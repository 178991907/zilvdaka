import { drizzle } from 'drizzle-orm/neon-http';
import { neon, type NeonHttpDatabase } from '@neondatabase/serverless';
import * as schema from './schema';
import 'dotenv/config';

let db: NeonHttpDatabase<typeof schema>;
let dbInitializationError: Error | null = null;

let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  dbInitializationError = new Error("DATABASE_URL is not set. Database operations will be disabled.");
  console.warn(dbInitializationError.message);
} else {
  try {
    // Clean up the connection string to handle common copy-paste errors
    // from psql or other clients.
    const urlMatch = connectionString.match(/postgresql:\/\/[^']+/);
    if (urlMatch) {
      connectionString = urlMatch[0];
    }

    const sql = neon(connectionString);
    db = drizzle(sql, { schema });
  } catch (error) {
    dbInitializationError = error as Error;
    console.error("Failed to initialize database:", dbInitializationError);
  }
}

// @ts-ignore - This is a valid export pattern for conditional modules
export { db, dbInitializationError };
