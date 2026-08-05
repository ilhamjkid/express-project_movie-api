import type { PrismaClient } from "#prisma/client";
import type {
  AddWatchlistBodyInput,
  EditOrDeleteWatchlistParamsInput,
  EditWatchlistBodyInput,
  GetWatchlistItemsQueryInput,
} from "#modules/watchlists/watchlist.dto";
import { AppError } from "#errors/app.error";

export class WatchlistService {
  constructor(private prisma: PrismaClient) {}

  public addWatchlistItem = async (inputBody: AddWatchlistBodyInput, userId: string) => {
    const movieExists = await this.prisma.movie.findUnique({
      where: { id: inputBody.movieId },
    });
    if (!movieExists) {
      throw new AppError("Failed to add to watchlist. Movie not found.", 404);
    }

    const watchlistExists = await this.prisma.watchlistItem.findUnique({
      where: { userId_movieId: { userId, movieId: inputBody.movieId } },
    });
    if (watchlistExists) {
      throw new AppError("Failed to add to watchlist. Movie is already in the watchlist.", 400);
    }

    const watchlistItem = await this.prisma.watchlistItem.create({
      data: {
        userId,
        movieId: inputBody.movieId,
        ...(inputBody.status !== undefined ? { status: inputBody.status } : {}),
        ...(inputBody.rating !== undefined ? { rating: inputBody.rating } : {}),
        ...(inputBody.notes !== undefined ? { notes: inputBody.notes } : {}),
      },
    });

    return { watchlistItem };
  };

  public getWatchlistItems = async (
    { status, page, limit }: GetWatchlistItemsQueryInput,
    userId: string,
  ) => {
    const [totalItems, watchlistItems] = await this.prisma.$transaction([
      this.prisma.watchlistItem.count({ where: { userId, ...(status ? { status } : {}) } }),
      this.prisma.watchlistItem.findMany({
        where: { userId, ...(status ? { status } : {}) },
        include: {
          movie: {
            select: {
              id: true,
              title: true,
              posterUrl: true,
              releaseYear: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      watchlistItems,
      pagination: { page, limit, totalItems, totalPages },
    };
  };

  public deleteWatchlistItem = async (
    inputParams: EditOrDeleteWatchlistParamsInput,
    userId: string,
  ) => {
    const watchlistExists = await this.prisma.watchlistItem.findFirst({
      where: { id: inputParams.id, userId },
    });
    if (!watchlistExists) {
      throw new AppError("Failed to delete watchlist. Watchlist not found.", 404);
    }

    await this.prisma.watchlistItem.delete({
      where: { id: watchlistExists.id },
    });
  };

  public editWatchlistItem = async (
    inputParams: EditOrDeleteWatchlistParamsInput,
    inputBody: EditWatchlistBodyInput,
    userId: string,
  ) => {
    const watchlistExists = await this.prisma.watchlistItem.findFirst({
      where: { id: inputParams.id, userId },
    });
    if (!watchlistExists) {
      throw new AppError("Failed to edit watchlist. Watchlist not found.", 404);
    }

    const watchlistItem = await this.prisma.watchlistItem.update({
      where: { id: watchlistExists.id },
      data: {
        ...(inputBody.status !== undefined ? { status: inputBody.status } : {}),
        ...(inputBody.rating !== undefined ? { rating: inputBody.rating } : {}),
        ...(inputBody.notes !== undefined ? { notes: inputBody.notes } : {}),
      },
    });

    return { watchlistItem };
  };
}
