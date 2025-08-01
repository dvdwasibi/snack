# Snack

This repository contains a minimal Node.js (Express) server with a Vue.js front-end written in TypeScript.

## Getting Started

1. Install dependencies (requires internet access):
   ```sh
   npm install
   ```
2. Start the server (compiles the client script and runs with ts-node):
   ```sh
   npm start
   ```
3. Provide the `SUPABASE_DB_URL` and `SUPABASE_KEY` values either in a `.env` file
   or as environment variables before running the server. These are available from
   your Supabase project's settings.
4. Open `http://localhost:3000` in your browser to view the app.

## Supabase Users Table

Create a `users` table in your Supabase project so the application can store
information about everyone that signs in with Google. Run the setup script to
create the required tables:

```sh
SUPABASE_DB_URL=postgres://<user>:<password>@<host>:<port>/<db> npm run setup-db
```

Replace the connection string with the Database URL from your Supabase project.
The script will create any missing tables as we add them.
