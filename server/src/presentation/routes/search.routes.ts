import { Router } from 'express';
import type { SearchService } from '../../application/services/SearchService.js';
import { searchRateLimiter } from '../../infrastructure/http/middleware/rateLimiter.js';
import { validateQuery } from '../middleware/validateQuery.js';
import { searchRequestQuerySchema, type SearchRequestQuery } from './schemas/searchRequestQuery.js';

export function createSearchRouter(searchService: SearchService): Router {
  const router = Router();

  router.get('/', searchRateLimiter, validateQuery(searchRequestQuerySchema), async (_req, res, next) => {
    try {
      const { q, type, limit, offset } = res.locals.validatedQuery as SearchRequestQuery;
      const result = await searchService.search({ query: q, categories: type, limit, offset });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
