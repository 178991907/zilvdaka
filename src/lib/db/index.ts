import { drizzle } from 'drizzle-orm/neon-http';
import { neon, type NeonHttpDatabase } from '@neondatabase/serverless';
import * as schema from './schema';
import 'dotenv/config';

let db: NeonHttpDatabase<typeof schema>;
let dbInitializationError: Error | null = null;

if (!process.env.DATABASE_URL) {
  dbInitializationError = new Error("DATABASE_URL is not set. Database operations will be disabled.");
  console.warn(dbInitializationError.message);
}

try {
  const sql = neon(process.env.DATABASE_URL!);
  db = drizzle(sql, { schema });
} catch (error) {
  dbInitializationError = error as Error;
  console.error("Failed to initialize database:", dbInitializationError);
}

// @ts-ignore - This is a valid export pattern for conditional modules
export { db, dbInitializationError };
