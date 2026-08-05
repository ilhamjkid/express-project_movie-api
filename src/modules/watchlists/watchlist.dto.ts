import * as z from "zod";

export const getWatchlistItemsQuerySchema = z.object({
  status: z
    .enum(
      ["PLANNED", "WATCHING", "COMPLETED", "DROPPED"],
      "Status must be 'PLANNED', 'WATCHING', 'COMPLETED', or 'DROPPED'.",
    )
    .optional(),

  page: z.coerce
    .number("Page must be valid number.")
    .int("Page must be an integer.")
    .gte(1, "Page must be at least 1.")
    .default(1),

  limit: z.coerce
    .number("Limit must be valid number.")
    .int("Limit must be an integer.")
    .gte(1, "Limit must be at least 1.")
    .default(10),
});
export type GetWatchlistItemsQueryInput = z.infer<typeof getWatchlistItemsQuerySchema>;

export const addWatchlistBodySchema = z.object({
  movieId: z.string("Movie ID is required."),

  status: z
    .enum(
      ["PLANNED", "WATCHING", "COMPLETED", "DROPPED"],
      "Status must be 'PLANNED', 'WATCHING', 'COMPLETED', or 'DROPPED'.",
    )
    .optional(),

  rating: z
    .number("Rating must be valid number.")
    .int("Rating must be a whole number (no decimals).")
    .gte(0, "Rating cannot be negative number.")
    .lte(5, "Rating cannot be more than 5.")
    .nullish(),

  notes: z.string("Notes must be text.").min(1, "Notes cannot be empty text.").nullish(),
});
export type AddWatchlistBodyInput = z.infer<typeof addWatchlistBodySchema>;

export const editWatchlistBodySchema = addWatchlistBodySchema.omit({ movieId: true });
export type EditWatchlistBodyInput = z.infer<typeof editWatchlistBodySchema>;

export const editOrDeleteWatchlistParamsSchema = z.object({
  id: z.string("ID parameter is required.").min(1, "ID parameter cannot be empty."),
});
export type EditOrDeleteWatchlistParamsInput = z.infer<typeof editOrDeleteWatchlistParamsSchema>;
