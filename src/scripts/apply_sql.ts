import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

// Supabase DB URL is typically in the Connection String format or we construct it.
// Usually: postgres://postgres:[password]@[host]:[port]/postgres
// If local supabase, it's often: postgresql://postgres:postgres@127.0.0.1:54322/postgres
// Let's rely on DATABASE_URL or try to find it.

// Fallback to local default if not found
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/postgres';

console.log("Connecting to:", connectionString);

const client = new Client({
    connectionString: connectionString,
});

async function run() {
    await client.connect();
    console.log("Connected to DB.");

    const sql = `
  -- Fix RLS for Articles Table
  DROP POLICY IF EXISTS "Authenticated Manage Articles" ON public.articles;
  DROP POLICY IF EXISTS "Service role manages articles" ON public.articles;

  -- Allow Authenticated Users (Admins) to Insert/Update/Delete
  CREATE POLICY "Authenticated Manage Articles"
  ON public.articles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

  -- Ensure Service Role still has access (implied by bypass RLS, but for completeness)
  CREATE POLICY "Service Role Manage"
  ON public.articles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
  `;

    try {
        const res = await client.query(sql);
        console.log("SQL executed successfully.");
    } catch (err) {
        console.error("SQL error:", err);
    } finally {
        await client.end();
    }
}

run();
