const { createClient } = require('@libsql/client');
const { drizzle } = require('drizzle-orm/libsql');
const { migrate } = require('drizzle-orm/libsql/migrator');
const { readFileSync } = require('fs');
const path = require('path');

async function runMigrations() {
  const client = createClient({
    url: process.env.DATABASE_URL || 'file:./data/tvbox.db',
  });

  const db = drizzle(client);

  console.log('Running database migrations...');

  try {
    // Run migrations from the drizzle folder
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

runMigrations();
