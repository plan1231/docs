import { db } from './index';
import * as schema from './schema';

// This ensures the database tables are created
export async function initializeDatabase() {
  try {
    // Simple query to check if database is accessible
    await db.select().from(schema.series).limit(1);
    console.log('Database tables already exist');
  } catch {
    // Tables don't exist, create them manually
    console.log('Creating database tables...');

    // Create tables using raw SQL
    const client = (db as any).client;

    // Series table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS series (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tvdb_id INTEGER UNIQUE NOT NULL,
        title TEXT NOT NULL,
        first_air_year INTEGER,
        created_at INTEGER
      )
    `);

    // Seasons table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS seasons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        series_id INTEGER NOT NULL,
        season_number INTEGER NOT NULL,
        FOREIGN KEY (series_id) REFERENCES series(id)
      )
    `);

    // Episodes table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS episodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        season_id INTEGER NOT NULL,
        episode_number INTEGER NOT NULL,
        title TEXT,
        file_path TEXT,
        file_size INTEGER,
        s3_key TEXT,
        upload_status TEXT DEFAULT 'pending',
        error_message TEXT,
        uploaded_at INTEGER,
        created_at INTEGER,
        FOREIGN KEY (season_id) REFERENCES seasons(id)
      )
    `);

    // Movies table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tmdb_id INTEGER UNIQUE NOT NULL,
        title TEXT NOT NULL,
        year INTEGER,
        file_path TEXT,
        file_size INTEGER,
        s3_key TEXT,
        upload_status TEXT DEFAULT 'pending',
        error_message TEXT,
        uploaded_at INTEGER,
        created_at INTEGER
      )
    `);

    // Upload logs table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS upload_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        media_type TEXT NOT NULL,
        media_id INTEGER NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        s3_key TEXT NOT NULL,
        s3_bucket TEXT NOT NULL,
        status TEXT NOT NULL,
        error_message TEXT,
        logged_at INTEGER
      )
    `);

    console.log('Database tables created successfully');
  }
}
