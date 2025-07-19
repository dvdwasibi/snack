const { Client } = require('pg');
require('dotenv').config({ override: true });

async function main() {
  const connectionString = process.env.SUPABASE_DB_URL;
  if (!connectionString) {
    console.error('SUPABASE_DB_URL environment variable is required');
    process.exit(1);
  }

  const client = new Client({ connectionString });
  await client.connect();
  try {
    await client.query('create extension if not exists "uuid-ossp"');
    await client.query(`create table if not exists users (
      id uuid default uuid_generate_v4() primary key,
      email text not null unique,
      name text,
      stripeAccountId text
    )`);
    console.log('Supabase tables created or already exist');
  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error('Error setting up tables:', err);
  process.exit(1);
});
