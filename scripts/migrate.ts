// /home/leo/work/hashkey/matrixdocx_hashkey/scripts/migrate.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' }); // Load .env file

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.error('🔴 DATABASE_URL environment variable is not set.');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  // Pass an empty schema object or your actual schema if needed by other parts of your app,
  // but for migrations, Drizzle primarily uses the migrationsFolder.
  const db = drizzle(pool, { logger: true }); // Enable logger for more details

  console.log('⏳ Running migrations...');
  const startTime = Date.now();

  try {
    // Ensure the path to migrationsFolder is correct relative to your project root
    await migrate(db, { migrationsFolder: './drizzle/migrations' });
    const endTime = Date.now();
    console.log(`✅ Migrations completed in ${endTime - startTime}ms`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1); // Exit with error code
  } finally {
    await pool.end(); // Ensure the connection pool is closed
    process.exit(0); // Exit successfully
  }
}

runMigrations();
