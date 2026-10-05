import { z } from 'zod';

const searchCategorySchema = z.enum(['artist', 'album', 'track']);

export const searchRequestQuerySchema = z.object({
  q: z.string().trim().min(1, 'q must not be empty').max(200, 'q is too long'),
  type: z
    .string()
    .default('artist,album,track')
    .transform((value) => value.split(',').map((v) => v.trim()))
    .pipe(z.array(searchCategorySchema).min(1)),
  // Spotify Feb 2026 Dev Mode change: search limit max 50->10, default 20->5.
  limit: z.coerce.number().int().min(1).max(10).default(5),
  offset: z.coerce.number().int().min(0).max(1000).default(0),
});

export type SearchRequestQuery = z.infer<typeof searchRequestQuerySchema>;
