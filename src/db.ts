import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

export const initDb = (
  databaseFile = process.env.SQLITE_FILE || path.join(__dirname, '..', 'data', 'db.sqlite')
) => {
  if (db) return db;

  // ✅ Ensure directory exists
  const dir = path.dirname(databaseFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(databaseFile);
  console.log(`📦 SQLite database initialized at: ${databaseFile}`);

  // ✅ Create tables if not exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `);

  return db;
};

export const getDb = () => {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');
  return db;
};

export const closeDb = () => {
  if (db) {
    db.close();
    db = null;
  }
};
