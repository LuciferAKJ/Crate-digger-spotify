import { HttpError } from '../../../domain/errors/HttpError.js';
import type { SpotifyAuthClient } from './SpotifyAuthClient.js';

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
const REQUEST_TIMEOUT_MS = 8000;

export class SpotifyHttpClient {
  constructor(private readonly authClient: SpotifyAuthClient) {}

  async get(path: string, searchParams?: Record<string, string>): Promise<unknown> {
    const url = new URL(`${SPOTIFY_API_BASE_URL}${path}`);
    if (searchParams) {
      for (const [key, value] of Object.entries(searchParams)) {
        url.searchParams.set(key, value);
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let response: Response;
    try {
      const accessToken = await this.authClient.getAccessToken();
      response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new HttpError(504, {
          code: 'UPSTREAM_UNAVAILABLE',
          message: 'The music catalog took too long to respond. Please try again.',
        });
      }
      throw new HttpError(502, {
        code: 'UPSTREAM_UNAVAILABLE',
        message: 'Could not reach the music catalog.',
      });
    } finally {
      clearTimeout(timeout);
    }

    if (response.status === 429) {
      const retryAfterSeconds = Number(response.headers.get('Retry-After') ?? '5');
      throw new HttpError(429, {
        code: 'RATE_LIMITED',
        message: 'The music catalog is rate-limiting us right now. Please try again shortly.',
        retryAfterSeconds,
      });
    }

    if (response.status === 404) {
      throw new HttpError(404, { code: 'NOT_FOUND', message: 'The requested item could not be found.' });
    }

    if (!response.ok) {
      throw new HttpError(502, {
        code: 'UPSTREAM_UNAVAILABLE',
        message: `The music catalog returned an unexpected error (${response.status}).`,
      });
    }

    return response.json();
  }
}
