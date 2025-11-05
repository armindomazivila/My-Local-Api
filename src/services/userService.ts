import { getDb } from '../db';
import { User } from '../schemas/user';

interface UserFilter {
  name?: string;
  limit?: number;
}

export const getAllUsers = (filter?: UserFilter): User[] => {
  const db = getDb();
  try {
    let sql = 'SELECT id, name FROM users';
    const params: any[] = [];

    if (filter?.name) {
      sql += ' WHERE name LIKE ?';
      params.push(`%${filter.name}%`);
    }

    sql += ' ORDER BY id ASC';

    if (filter?.limit && Number.isInteger(filter.limit)) {
      sql += ' LIMIT ?';
      params.push(filter.limit);
    }

    const stmt = db.prepare(sql);
    return stmt.all(...params) as User[];
  } catch (err) {
    console.error('Error fetching users:', err);
    return [];
  }
};

export const getUserById = (id: number): User | null => {
  const db = getDb();
  try {
    const stmt = db.prepare('SELECT id, name FROM users WHERE id = ?');
    const row = stmt.get(id);
    return row ? (row as User) : null;
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    return null;
  }
};

export const createUser = (name: string): User | null => {
  const db = getDb();
  try {
    const insert = db.prepare('INSERT INTO users (name) VALUES (?)');
    const info = insert.run(name);
    const id = Number(info.lastInsertRowid);
    return { id, name };
  } catch (err) {
    console.error('Error creating user:', err);
    return null;
  }
};

export const updateUser = (id: number, name: string): User | null => {
  const db = getDb();
  try {
    const update = db.prepare('UPDATE users SET name = ? WHERE id = ?');
    const info = update.run(name, id);
    if (info.changes === 0) return null;
    return { id, name };
  } catch (err) {
    console.error('Error updating user:', err);
    return null;
  }
};

export const deleteUser = (id: number): User | null => {
  const db = getDb();
  try {
    const stmt = db.prepare('SELECT id, name FROM users WHERE id = ?');
    const user = stmt.get(id) as User | undefined;
    if (!user) return null;

    const del = db.prepare('DELETE FROM users WHERE id = ?');
    del.run(id);
    return user;
  } catch (err) {
    console.error('Error deleting user:', err);
    return null;
  }
};
