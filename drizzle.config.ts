import type { Config } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  // This is a warning now instead of an error to allow local dev without a DB.
  // Drizzle Kit will still fail if it tries to run without a DB URL, which is expected.
  console.warn('DATABASE_URL is not set in .env file. Drizzle Kit commands might fail.');
}

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!, // Use non-null assertion as Drizzle CLI needs it
  },
} satisfies Config;
