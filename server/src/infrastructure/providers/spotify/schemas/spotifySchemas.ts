import { z } from 'zod';

export const spotifyImageSchema = z.object({
  url: z.string(),
  width: z.number().nullable(),
  height: z.number().nullable(),
});

export const spotifySimplifiedArtistSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const spotifyFullArtistSchema = spotifySimplifiedArtistSchema.extend({
  images: z.array(spotifyImageSchema).nullish().transform((val) => val ?? []),
  popularity: z.number().nullish().transform((val) => val ?? 0),
  genres: z.array(z.string()).nullish().transform((val) => val ?? []),
  followers: z.object({ total: z.number().nullish() }).nullish(),
});

export const spotifyArtistResponseSchema = spotifyFullArtistSchema;

export const spotifySimplifiedAlbumSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(spotifyImageSchema).default([]),
  album_type: z.enum(['album', 'single', 'compilation']),
  release_date: z.string(),
  release_date_precision: z.enum(['year', 'month', 'day']),
  total_tracks: z.number().default(0),
  artists: z.array(spotifySimplifiedArtistSchema).default([]),
});

export const spotifyFullAlbumSchema = spotifySimplifiedAlbumSchema.extend({
  label: z.string().nullable().optional(),
  copyrights: z.array(z.object({ text: z.string(), type: z.string() })).default([]),
  popularity: z.number().nullable().optional(),
});

export const spotifyTrackSchema = z.object({
  id: z.string(),
  name: z.string(),
  track_number: z.number().default(1),
  disc_number: z.number().default(1),
  duration_ms: z.number().default(0),
  explicit: z.boolean().default(false),
  popularity: z.number().default(0),
  preview_url: z.string().nullable().optional(),
  album: spotifySimplifiedAlbumSchema,
  artists: z.array(spotifySimplifiedArtistSchema).default([]),
});

const pagedSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
  });

export const spotifySearchResponseSchema = z.object({
  artists: pagedSchema(spotifyFullArtistSchema).optional(),
  albums: pagedSchema(spotifySimplifiedAlbumSchema).optional(),
  tracks: pagedSchema(spotifyTrackSchema).optional(),
});

export type SpotifySearchResponse = z.infer<typeof spotifySearchResponseSchema>;
export type SpotifyFullArtist = z.infer<typeof spotifyFullArtistSchema>;
export type SpotifyArtistResponse = SpotifyFullArtist;
export type SpotifySimplifiedAlbum = z.infer<typeof spotifySimplifiedAlbumSchema>;
export type SpotifyTrack = z.infer<typeof spotifyTrackSchema>;
