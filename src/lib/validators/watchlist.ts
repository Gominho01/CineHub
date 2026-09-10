import { z } from 'zod';

export const addWatchlistItemSchema = z.object({
  movieId: z.number().int().positive(),
  title: z.string().min(1),
  posterPath: z.string().nullable().optional(),
  genreIds: z.array(z.number().int()).default([]),
});

export const updateRatingSchema = z.object({
  rating: z.number().int().min(1).max(5).nullable(),
});

export type AddWatchlistItemBody = z.infer<typeof addWatchlistItemSchema>;
export type UpdateRatingBody = z.infer<typeof updateRatingSchema>;
