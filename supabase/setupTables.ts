import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ override: true });

async function main(): Promise<void> {
  const url = process.env.SUPABASE_URL || process.env.SUPABASE_DB_URL;
  const key = process.env.SUPABASE_KEY;
  if (!url || !key) {
    console.error('SUPABASE_URL and SUPABASE_KEY environment variables are required');
    process.exit(1);
  }

  const supabase = createClient(url, key);

  const sql = `
    create extension if not exists "uuid-ossp";
    create table if not exists users (
      id uuid default uuid_generate_v4() primary key,
      email text not null unique,
      name text,
      stripeAccountId text
    );`;

  const { error } = await supabase.rpc('execute_sql', { sql });
  if (error) throw error;

  console.log('Supabase tables created or already exist');
}

main().catch(err => {
  console.error('Error setting up tables:', err);
  process.exit(1);
});
