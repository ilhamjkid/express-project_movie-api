import * as z from "zod";

const MOVIE_GENRES = [
  "ACTION",
  "ADVENTURE",
  "BIOGRAPHY",
  "COMEDY",
  "CRIME",
  "DRAMA",
  "HORROR",
  "ROMANCE",
  "SCI_FI",
  "THRILLER",
] as const;

export const addOrEditMovieBodySchema = z.object({
  title: z
    .string("Title is required and must be valid text.")
    .trim()
    .min(1, "Title cannot be empty text.")
    .max(255, "Title must be at most 255 characters."),

  overview: z
    .string("Overview must be valid text.")
    .trim()
    .min(1, "Overview cannot be empty text.")
    .max(1000, "Overview must be at most 1000 characters.")
    .nullish(),

  releaseYear: z
    .number("Release year is required and must be a valid 4-digit number.")
    .int("Release year is required and must be a valid 4-digit number.")
    .gte(1888, "Release year must be 1888 or later.")
    .refine(
      (val) => val <= new Date().getFullYear() + 5,
      "Release year must be at most 5 years in the future.",
    ),

  genres: z
    .array(
      z.enum(MOVIE_GENRES, "Genres selection is invalid."),
      "Genres selection must be a list of items.",
    )
    .max(MOVIE_GENRES.length, `Genres must be at most ${MOVIE_GENRES.length} items.`)
    .refine((val) => new Set(val).size === val.length, "Genres must not contain duplicate items.")
    .optional(),

  runtime: z
    .number("Runtime must be a valid number.")
    .int("Runtime must be a valid number.")
    .gte(1, "Runtime must be at least 1 minute.")
    .lte(500, "Runtime must be at most 500 minutes.")
    .nullish(),

  posterUrl: z
    .url("Poster URL must be a valid website link.")
    .max(2048, "Poster URL must be at most 2048 characters.")
    .nullish(),
});
export type AddOrEditMovieBodyInput = z.infer<typeof addOrEditMovieBodySchema>;

export const handleSingleMovieParamsSchema = z.object({
  id: z.uuid("ID parameter is required and must be a valid UUID."),
});
export type HandleSingleMovieParamsInput = z.infer<typeof handleSingleMovieParamsSchema>;

export const getMoviesQuerySchema = z.object({
  search: z.preprocess(
    (val) => {
      let arrayValue;
      if (typeof val === "string") {
        const sanitized = val.replace(/[^\w\s]/gi, "");
        arrayValue = sanitized.trim().split(/\s+/);
      } else if (Array.isArray(val)) {
        arrayValue = val.flatMap((v) => {
          if (typeof v !== "string") return [];
          return v
            .replace(/[^\w\s]/gi, "")
            .trim()
            .split(/\s+/);
        });
      } else return val;
      const arrayValueFiltered = arrayValue.filter((av) => av !== "");
      if (arrayValueFiltered.length !== 0) return arrayValueFiltered;
      return undefined;
    },
    z
      .array(
        z.string("Search must be valid text or list of texts."),
        "Search must be valid text or list of texts.",
      )
      .transform((val) => val.map((v) => `${v}:*`).join(" & "))
      .optional(),
  ),

  releaseYear: z.preprocess(
    (val) => (val !== "" ? val : undefined),
    z.coerce
      .number("Release year must be a valid 4-digit number.")
      .int("Release year must be a valid 4-digit number.")
      .optional(),
  ),

  genres: z.preprocess(
    (val) => {
      let arrayValue;
      if (typeof val === "string") arrayValue = val.split(",");
      else if (Array.isArray(val)) arrayValue = [...val];
      else return val;
      const arrayValueFiltered = arrayValue.filter((av) => av !== "");
      if (arrayValueFiltered.length !== 0) return arrayValueFiltered;
      return undefined;
    },
    z
      .array(
        z.enum(MOVIE_GENRES, "Genres selection is invalid."),
        "Genres selection must be a list of items.",
      )
      .max(MOVIE_GENRES.length, `Genres must be at most ${MOVIE_GENRES.length} items.`)
      .refine((val) => new Set(val).size === val.length, "Genres must not contain duplicate items.")
      .optional(),
  ),

  page: z.preprocess(
    (val) => (val !== "" ? val : undefined),
    z.coerce
      .number("Page must be valid number.")
      .int("Page must be an integer.")
      .gte(1, "Page must be at least 1.")
      .default(1),
  ),

  limit: z.preprocess(
    (val) => (val !== "" ? val : undefined),
    z.coerce
      .number("Limit must be valid number.")
      .int("Limit must be an integer.")
      .gte(1, "Limit must be at least 1.")
      .default(10),
  ),
});
export type GetMoviesQueryInput = z.infer<typeof getMoviesQuerySchema>;
