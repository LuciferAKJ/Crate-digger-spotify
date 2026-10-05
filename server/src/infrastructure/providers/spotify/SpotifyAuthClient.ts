const TOKEN_URL = 'https://accounts.spotify.com/api/token';

/** Refresh this many seconds before actual expiry, to absorb request latency. */
const EXPIRY_SAFETY_MARGIN_SECONDS = 60;

interface CachedToken {
  accessToken: string;
  expiresAtEpochMs: number;
}

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/**
 * Owns the Client Credentials flow against Spotify's Accounts service.
 * This is intentionally the *only* place in the codebase that knows the
 * app's client secret exists — it never leaves this process, and it is
 * never exposed to the client over HTTP.
 *
 * The in-memory cache is sufficient for a single-instance deployment; if
 * this ever runs across multiple server instances, the cache should move
 * to a shared store (e.g. Redis) so instances don't each mint their own
 * token unnecessarily. Flagged here rather than solved prematurely.
 */
export class SpotifyAuthClient {
  private cachedToken: CachedToken | null = null;
  private pendingRequest: Promise<string> | null = null;

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  async getAccessToken(): Promise<string> {
    if (this.cachedToken && this.cachedToken.expiresAtEpochMs > Date.now()) {
      return this.cachedToken.accessToken;
    }

    // Multiple concurrent callers hitting an expired token should share a
    // single in-flight refresh rather than each firing their own request.
    if (!this.pendingRequest) {
      this.pendingRequest = this.requestNewToken().finally(() => {
        this.pendingRequest = null;
      });
    }

    return this.pendingRequest;
  }

  private async requestNewToken(): Promise<string> {
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Spotify token request failed (${response.status}): ${body}`);
    }

    const data = (await response.json()) as SpotifyTokenResponse;

    this.cachedToken = {
      accessToken: data.access_token,
      expiresAtEpochMs: Date.now() + (data.expires_in - EXPIRY_SAFETY_MARGIN_SECONDS) * 1000,
    };

    return this.cachedToken.accessToken;
  }
}
