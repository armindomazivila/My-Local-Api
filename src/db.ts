import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export const initDb = (databaseFile = process.env.SQLITE_FILE || path.join(__dirname, '..', 'data', 'db.sqlite')) => {
  if (db) return db;
  db = new Database(databaseFile);
  // Create table if not exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);
  return db;
};

export const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
};

export const closeDb = async () => {
  if (db) {
    db.close();
    db = null;
  }
};