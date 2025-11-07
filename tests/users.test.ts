import request from 'supertest';
import { createApp } from '../src/app';
import { initDb, closeDb, getDb } from '../src/db';
import fs from 'fs';
import path from 'path';

const TEST_DB = path.join(__dirname, '..', 'data', 'test.sqlite');
let app: ReturnType<typeof createApp>;

// Ensure DB folder exists and initialize before tests
beforeAll(async () => {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);

  initDb(TEST_DB);
  app = createApp();
});

// Clean database before each test for isolation
beforeEach(() => {
  const db = getDb();
  db.prepare('DELETE FROM users').run();
});

// Close DB and delete test file after all tests
afterAll(async () => {
  await closeDb();
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
});

describe('Users API', () => {
  it('GET / responds with hello message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Hello from my local API/i);
  });

  it('GET /users initially returns an empty array', async () => {
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

  it('GET /users/:id returns a specific user', async () => {
    const create = await request(app).post('/users').send({ name: 'Bob' });
    const id = create.body.user.id;

    const res = await request(app).get(`/users/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Bob');
  });

  it('PUT /users/:id updates a user', async () => {
    const create = await request(app).post('/users').send({ name: 'Charlie' });
    const id = create.body.user.id;

    const res = await request(app).put(`/users/${id}`).send({ name: 'Charlie Updated' });
    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe('Charlie Updated');
  });

  it('DELETE /users/:id deletes a user', async () => {
    const create = await request(app).post('/users').send({ name: 'Dave' });
    const id = create.body.user.id;

    const del = await request(app).delete(`/users/${id}`);
    expect(del.status).toBe(200);

    const after = await request(app).get('/users');
    expect(after.body.length).toBe(0);
  });

  //  Extra validation tests
  it('POST /users rejects invalid input', async () => {
    const res = await request(app).post('/users').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('GET /users/:id returns 404 for non-existent user', async () => {
    const res = await request(app).get('/users/9999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});
