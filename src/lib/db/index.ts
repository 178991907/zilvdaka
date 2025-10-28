import { drizzle } from 'drizzle-orm/neon-http';
import { neon, type NeonHttpDatabase } from '@neondatabase/serverless';
import * as schema from './schema';
import 'dotenv/config';

let db: NeonHttpDatabase<typeof schema> | null = null;
let dbInitializationError: Error | null = null;

try {
  if (process.env.DATABASE_URL) {
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema });
  } else {
    console.warn("DATABASE_URL is not set. Database operations will be disabled. Falling back to localStorage.");
  }
} catch (error) {
  dbInitializationError = error as Error;
  console.error("Failed to initialize database:", dbInitializationError);
  db = null;
}

export { db, dbInitializationError };
