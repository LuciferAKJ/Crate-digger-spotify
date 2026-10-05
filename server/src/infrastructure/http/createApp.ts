import compression from 'compression';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from '../config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { createApiRouter } from '../../presentation/routes/index.js';
import { createProductionDependencies, type AppDependencies } from '../composition/createProductionDependencies.js';

export function createApp(deps: AppDependencies = createProductionDependencies()): Express {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: false }));
  app.use(compression());
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(express.json());
  app.use('/api', apiRateLimiter, createApiRouter(deps));
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
