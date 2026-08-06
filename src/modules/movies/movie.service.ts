import type { Prisma, PrismaClient } from "#prisma/client";
import type {
  AddOrEditMovieBodyInput,
  GetMoviesQueryInput,
  HandleSingleMovieParamsInput,
} from "#modules/movies/movie.dto";
import { AppError } from "#errors/app.error";

export class MovieService {
  constructor(private prisma: PrismaClient) {}

  public addMovie = async (
    { title, releaseYear, overview, genres, runtime, posterUrl }: AddOrEditMovieBodyInput,
    uploaderId: string,
  ) => {
    const duplicateMovieExists = await this.prisma.movie.findFirst({
      where: { title, releaseYear },
    });
    if (duplicateMovieExists) {
      throw new AppError(
        "Failed to upload. Movie with the same title and release year already exists.",
        400,
      );
    }

    const movie = await this.prisma.movie.create({
      data: {
        uploaderId,
        title,
        releaseYear,
        ...(overview !== undefined ? { overview } : {}),
        ...(genres !== undefined ? { genres } : {}),
        ...(runtime !== undefined ? { runtime } : {}),
        ...(posterUrl !== undefined ? { posterUrl } : {}),
      },
      select: {
        id: true,
        title: true,
        releaseYear: true,
        genres: true,
        posterUrl: true,
      },
    });

    return { movie };
  };

  public getMovies = async ({ page, limit, search, releaseYear, genres }: GetMoviesQueryInput) => {
    const hasFilter = Boolean(search ?? releaseYear ?? genres);
    const whereOptUseFilter: Prisma.MovieWhereInput = {
      AND: [
        ...(search ? [{ OR: [{ title: { search } }, { overview: { search } }] }] : []),
        ...(releaseYear ? [{ releaseYear }] : []),
        ...(genres ? [{ genres: { hasSome: genres } }] : []),
      ],
    };
    const [totalItems, movies] = await this.prisma.$transaction([
      this.prisma.movie.count({
        where: hasFilter ? whereOptUseFilter : {},
      }),
      this.prisma.movie.findMany({
        where: hasFilter ? whereOptUseFilter : {},
        select: {
          id: true,
          title: true,
          releaseYear: true,
          genres: true,
          posterUrl: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);
    const totalPages = Math.ceil(totalItems / limit);

    return { movies, pagination: { page, limit, totalItems, totalPages } };
  };

  public getMovieDetails = async (inputParams: HandleSingleMovieParamsInput) => {
    const movieExists = await this.prisma.movie.findUnique({
      where: { id: inputParams.id },
      include: { uploader: { select: { id: true, name: true } } },
    });
    if (!movieExists) {
      throw new AppError("Failed to get details. Movie not found.", 404);
    }

    return { movie: movieExists };
  };

  public deleteMovie = async (inputParams: HandleSingleMovieParamsInput) => {
    const movieExists = await this.prisma.movie.findUnique({
      where: { id: inputParams.id },
    });
    if (!movieExists) {
      throw new AppError("Failed to delete. Movie not found.", 404);
    }

    await this.prisma.movie.delete({
      where: { id: movieExists.id },
    });
  };

  public editMovie = async (
    inputParams: HandleSingleMovieParamsInput,
    { title, releaseYear, overview, genres, runtime, posterUrl }: AddOrEditMovieBodyInput,
  ) => {
    const duplicateMovieExists = await this.prisma.movie.findFirst({
      where: { id: { not: inputParams.id }, title, releaseYear },
    });
    if (duplicateMovieExists) {
      throw new AppError(
        "Failed to edit. Movie with the same title and release year already exists.",
        400,
      );
    }

    const movieExists = await this.prisma.movie.findUnique({
      where: { id: inputParams.id },
    });
    if (!movieExists) {
      throw new AppError("Failed to edit. Movie not found.", 404);
    }

    const movie = await this.prisma.movie.update({
      where: { id: movieExists.id },
      data: {
        title,
        releaseYear,
        ...(overview !== undefined ? { overview } : {}),
        ...(genres !== undefined ? { genres } : {}),
        ...(runtime !== undefined ? { runtime } : {}),
        ...(posterUrl !== undefined ? { posterUrl } : {}),
      },
      select: {
        id: true,
        title: true,
        releaseYear: true,
        genres: true,
        posterUrl: true,
      },
    });

    return { movie };
  };
}
