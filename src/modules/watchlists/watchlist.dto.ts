import * as z from "zod";

export const watchlistSchema = z.object({
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
export type WatchlistInput = z.infer<typeof watchlistSchema>;

export const editWatchlistSchema = watchlistSchema.omit({ movieId: true });
export type EditWatchlistInput = z.infer<typeof editWatchlistSchema>;
