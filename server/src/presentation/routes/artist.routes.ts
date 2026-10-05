import { Router } from 'express';
import type { ArtistService } from '../../application/services/ArtistService.js';
import { validateParams } from '../middleware/validateParams.js';
import { artistRequestParamsSchema, type ArtistRequestParams } from './schemas/artistRequestParams.js';

export function createArtistRouter(artistService: ArtistService): Router {
  const router = Router();

  router.get('/:id', validateParams(artistRequestParamsSchema), async (_req, res, next) => {
    try {
      const { id } = res.locals.validatedParams as ArtistRequestParams;
      const artist = await artistService.getArtist(id);
      res.status(200).json(artist);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
