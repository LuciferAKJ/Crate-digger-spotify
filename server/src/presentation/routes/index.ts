import { Router } from 'express';
import type { AppDependencies } from '../../infrastructure/composition/createProductionDependencies.js';
import { healthRouter } from './health.routes.js';
import { createSearchRouter } from './search.routes.js';
import { createArtistRouter } from './artist.routes.js';

export function createApiRouter(deps: AppDependencies): Router {
  const router = Router();
  router.use('/health', healthRouter);
  router.use('/search', createSearchRouter(deps.searchService));
  router.use('/artists', createArtistRouter(deps.artistService));
  return router;
}
