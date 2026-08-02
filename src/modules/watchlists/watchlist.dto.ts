import * as z from "zod";

export const watchlistSchema = z.object({
  movieId: z.string("Movie ID is required."),

  status: z.preprocess(
    (val) => (val === null ? undefined : val),
    z
      .enum(
        ["PLANNED", "WATCHING", "COMPLETED", "DROPPED"],
        "Status must be 'PLANNED', 'WATCHING', 'COMPLETED', or 'DROPPED'.",
      )
      .default("PLANNED"),
  ),

  rating: z
    .number("Rating must be valid number.")
    .gte(0, "Rating cannot be negative number.")
    .lte(5, "Rating cannot be more than 5.")
    .nullable()
    .default(null),

  notes: z
    .string("Notes must be text.")
    .min(1, "Notes cannot be empty text.")
    .nullable()
    .default(null),
});
export type WatchlistInput = z.infer<typeof watchlistSchema>;
