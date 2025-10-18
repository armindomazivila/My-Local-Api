import request from 'supertest';
import { createApp } from '../src/app';
import { initDb, closeDb } from '../src/db';
import fs from 'fs';
import path from 'path';

const TEST_DB = path.join(__dirname, '..', 'data', 'test.sqlite');

beforeAll(() => {
  // Ensure test DB location exists
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);

  initDb(TEST_DB);
});

afterAll(async () => {
  await closeDb();
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
});

describe('Users API', () => {
  const app = createApp();

  it('GET / responds with hello', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Hello from my local API/);
  });

  it('GET /users initially returns empty array', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('POST /users creates a user and GET /users returns it', async () => {
    const create = await request(app).post('/users').send({ name: 'Alice' });
    expect(create.status).toBe(201);
    expect(create.body.user).toHaveProperty('id');
    expect(create.body.user.name).toBe('Alice');

    const list = await request(app).get('/users');
    expect(list.status).toBe(200);
    expect(list.body.length).toBe(1);
    expect(list.body[0].name).toBe('Alice');
  });

  it('GET /users/:id returns a user', async () => {
    const list = await request(app).get('/users');
    const id = list.body[0].id;
    const res = await request(app).get(`/users/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Alice');
  });

  it('PUT /users/:id updates a user', async () => {
    const list = await request(app).get('/users');
    const id = list.body[0].id;
    const res = await request(app).put(`/users/${id}`).send({ name: 'Alice Updated' });
    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe('Alice Updated');
  });

  it('DELETE /users/:id deletes a user', async () => {
    const list = await request(app).get('/users');
    const id = list.body[0].id;
    const res = await request(app).delete(`/users/${id}`);
    expect(res.status).toBe(200);
    const after = await request(app).get('/users');
    expect(after.body.length).toBe(0);
  });
});