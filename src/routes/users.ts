import express from 'express';
import { z } from 'zod';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../services/userService';
import { createUserSchema, updateUserSchema } from '../schemas/user';

const router = express.Router();

// GET /users?name=&limit=
router.get('/', (req, res) => {
  const schema = z.object({
    name: z.string().optional(),
    limit: z
      .string()
      .regex(/^
      \d+$/)
      .optional()
  });

  const parse = schema.safeParse(req.query);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

  const { name, limit } = parse.data;
  const users = getAllUsers({ name, limit: limit ? parseInt(limit, 10) : undefined });
  res.json(users);
});

// GET /users/:id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  const user = getUserById(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST /users
router.post('/', (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors.map(e => e.message).join(', ') });
  }

  const created = createUser(parsed.data.name);
  res.status(201).location(`/users/${created.id}`).json({ message: 'User created', user: created });
});

// PUT /users/:id
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors.map(e => e.message).join(', ') });
  }

  const updated = updateUser(id, parsed.data.name);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User updated', user: updated });
});

// DELETE /users/:id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  const deleted = deleteUser(id);
  if (!deleted) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted', user: deleted });
});

export default router;