import { describe, expect, it, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import type { Artist } from '@crate-digger/shared';
import { createArtistRouter } from '../artist.routes.js';
import type { ArtistService } from '../../../application/services/ArtistService.js';
import { HttpError } from '../../../domain/errors/HttpError.js';

const fakeArtist: Artist = {
  id: '4Z8W4fKeB5YxbusRsdQVPb',
  name: 'Radiohead',
  images: [{ url: 'https://example.com/art.jpg', width: 640, height: 640 }],
  popularity: 82,
  genres: ['art rock', 'alternative rock'],
  followerCount: 9876543,
};

function createMockArtistService(): ArtistService {
  return {
    getArtist: vi.fn(),
  } as unknown as ArtistService;
}

function createMockResponse(): Response {
  const res = {
    locals: {},
  } as unknown as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe('artist.routes (GET /api/artists/:id)', () => {
  it('returns 200 with the domain Artist for a valid ID', async () => {
    const mockService = createMockArtistService();
    vi.mocked(mockService.getArtist).mockResolvedValue(fakeArtist);

    const router = createArtistRouter(mockService);
    // Extract route layer
    const route = router.stack.find((layer) => layer.route?.path === '/:id')?.route;
    expect(route).toBeDefined();

    const validateMiddleware = route?.stack[0]?.handle;
    const handleGet = route?.stack[1]?.handle;
    expect(validateMiddleware).toBeDefined();
    expect(handleGet).toBeDefined();

    const req = { params: { id: '4Z8W4fKeB5YxbusRsdQVPb' } } as unknown as Request;
    const res = createMockResponse();
    const next: NextFunction = vi.fn();

    // 1. Run validation middleware
    validateMiddleware!(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(res.locals.validatedParams).toEqual({ id: '4Z8W4fKeB5YxbusRsdQVPb' });

    // 2. Run route handler
    await handleGet!(req, res, next);
    expect(mockService.getArtist).toHaveBeenCalledWith('4Z8W4fKeB5YxbusRsdQVPb');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeArtist);
  });

  it('rejects an invalid artist ID with 400 INVALID_REQUEST', () => {
    const mockService = createMockArtistService();
    const router = createArtistRouter(mockService);
    const route = router.stack.find((layer) => layer.route?.path === '/:id')?.route;
    const validateMiddleware = route?.stack[0]?.handle;
    expect(validateMiddleware).toBeDefined();

    const req = { params: { id: 'invalid/id!' } } as unknown as Request;
    const res = createMockResponse();
    const next: NextFunction = vi.fn();

    validateMiddleware!(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        payload: expect.objectContaining({ code: 'INVALID_REQUEST' }),
      }),
    );
  });

  it('passes 404 NOT_FOUND to next when artist is not found', async () => {
    const mockService = createMockArtistService();
    const notFoundError = new HttpError(404, { code: 'NOT_FOUND', message: 'Artist not found.' });
    vi.mocked(mockService.getArtist).mockRejectedValue(notFoundError);

    const router = createArtistRouter(mockService);
    const route = router.stack.find((layer) => layer.route?.path === '/:id')?.route;
    const validateMiddleware = route?.stack[0]?.handle;
    const handleGet = route?.stack[1]?.handle;
    expect(validateMiddleware).toBeDefined();
    expect(handleGet).toBeDefined();

    const req = { params: { id: '4Z8W4fKeB5YxbusRsdQVPb' } } as unknown as Request;
    const res = createMockResponse();
    const next: NextFunction = vi.fn();

    validateMiddleware!(req, res, next);
    await handleGet!(req, res, next);

    expect(next).toHaveBeenCalledWith(notFoundError);
  });

  it('passes 502 UPSTREAM_UNAVAILABLE to next when music catalog fails', async () => {
    const mockService = createMockArtistService();
    const upstreamError = new HttpError(502, { code: 'UPSTREAM_UNAVAILABLE', message: 'Catalog unreachable.' });
    vi.mocked(mockService.getArtist).mockRejectedValue(upstreamError);

    const router = createArtistRouter(mockService);
    const route = router.stack.find((layer) => layer.route?.path === '/:id')?.route;
    const validateMiddleware = route?.stack[0]?.handle;
    const handleGet = route?.stack[1]?.handle;
    expect(validateMiddleware).toBeDefined();
    expect(handleGet).toBeDefined();

    const req = { params: { id: '4Z8W4fKeB5YxbusRsdQVPb' } } as unknown as Request;
    const res = createMockResponse();
    const next: NextFunction = vi.fn();

    validateMiddleware!(req, res, next);
    await handleGet!(req, res, next);

    expect(next).toHaveBeenCalledWith(upstreamError);
  });
});
