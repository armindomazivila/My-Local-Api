import { getDb } from '../db';
import { User } from '../schemas/user';

export const getAllUsers = (filter?: { name?: string; limit?: number }): User[] => {
  const db = getDb();
  let sql = 'SELECT id, name FROM users';
  const params: any[] = [];

  if (filter?.name) {
    sql += ' WHERE LOWER(name) LIKE ?';
    params.push(`%${filter.name.toLowerCase()}%`);
  }

  sql += ' ORDER BY id ASC';

  if (filter?.limit && Number.isInteger(filter.limit)) {
    sql += ' LIMIT ?';
    params.push(filter.limit);
  }

  const stmt = db.prepare(sql);
  return stmt.all(...params) as User[];
};

export const getUserById = (id: number): User | null => {
  const db = getDb();
  const stmt = db.prepare('SELECT id, name FROM users WHERE id = ?');
  const row = stmt.get(id);
  return row ? (row as User) : null;
};

export const createUser = (name: string): User => {
  const db = getDb();
  const insert = db.prepare('INSERT INTO users (name) VALUES (?)');
  const info = insert.run(name);
  const id = Number(info.lastInsertRowid);
  return { id, name };
};

export const updateUser = (id: number, name: string): User | null => {
  const db = getDb();
  const update = db.prepare('UPDATE users SET name = ? WHERE id = ?');
  const info = update.run(name, id);
  if (info.changes === 0) return null;
  return { id, name };
};

export const deleteUser = (id: number): User | null => {
  const db = getDb();
  const stmt = db.prepare('SELECT id, name FROM users WHERE id = ?');
  const user = stmt.get(id) as User | undefined;
  if (!user) return null;
  const del = db.prepare('DELETE FROM users WHERE id = ?');
  del.run(id);
  return user;
};