import { createApp } from './app';
import { initDb, closeDb } from './db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const start = async () => {
  // Initialize DB (create tables if needed)
  initDb();

  const app = createApp();
  const server = app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
    console.log(`Docs available at http://localhost:${PORT}/docs`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('Shutting down...');
    server.close(async (err?: Error) => {
      if (err) {
        console.error('Error closing server', err);
        process.exit(1);
      }
      try {
        await closeDb();
        console.log('DB closed');
        process.exit(0);
      } catch (e) {
        console.error('Error closing DB', e);
        process.exit(1);
      }
    });

    // Force exit in 10s if graceful shutdown hangs
    setTimeout(() => {
      console.warn('Forcing shutdown');
      process.exit(1);
    }, 10_000).unref();
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

start().catch((err) => {
  console.error('Failed to start', err);
  process.exit(1);
});