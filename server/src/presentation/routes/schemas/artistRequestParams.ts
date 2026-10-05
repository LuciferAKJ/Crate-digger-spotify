import { z } from 'zod';

export const artistRequestParamsSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, 'Artist ID must not be empty')
    .max(100, 'Artist ID is too long')
    .regex(/^[a-zA-Z0-9]+$/, 'Artist ID must be alphanumeric'),
});

export type ArtistRequestParams = z.infer<typeof artistRequestParamsSchema>;
