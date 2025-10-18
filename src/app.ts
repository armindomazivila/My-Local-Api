import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import usersRouter from './routes/users';
import { json } from 'express';

export const createApp = () => {
  const app = express();

  // Basic security & middleware
  app.use(helmet());
  app.use(cors());
  app.use(morgan('dev'));

  // Body limit for production safety
  app.use(json({ limit: '10kb' }));

  // Rate limiting - simple example (adjust for production)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use(limiter);

  // Routes
  app.get('/', (req, res) => res.send('🚀 Hello from my local API!'));
  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/users', usersRouter);

  // OpenAPI docs
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // 404
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
};