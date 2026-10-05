import { Router } from 'express';
import type { AppDependencies } from '../../infrastructure/composition/createProductionDependencies.js';
import { healthRouter } from './health.routes.js';
import { createSearchRouter } from './search.routes.js';

export function createApiRouter(deps: AppDependencies): Router {
  const router = Router();
  router.use('/health', healthRouter);
  router.use('/search', createSearchRouter(deps.searchService));
  return router;
}
