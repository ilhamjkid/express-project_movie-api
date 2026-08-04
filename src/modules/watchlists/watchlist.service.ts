import type { PrismaClient } from "#prisma/client";
import type { EditWatchlistInput, WatchlistInput } from "#modules/watchlists/watchlist.dto";
import { AppError } from "#errors/app.error";

export class WatchlistService {
  constructor(private prisma: PrismaClient) {}

  public addWatchlistItem = async (watchlistInput: WatchlistInput, userId: string) => {
    const movieExists = await this.prisma.movie.findUnique({
      where: { id: watchlistInput.movieId },
    });
    if (!movieExists) {
      throw new AppError("Failed to add to watchlist. Movie not found.", 404);
    }

    const watchlistExists = await this.prisma.watchlistItem.findUnique({
      where: { userId_movieId: { userId, movieId: watchlistInput.movieId } },
    });
    if (watchlistExists) {
      throw new AppError("Failed to add to watchlist. The movie is already in the watchlist.", 400);
    }

    const watchlistItem = await this.prisma.watchlistItem.create({
      data: {
        userId,
        movieId: watchlistInput.movieId,
        ...(watchlistInput.status !== undefined ? { status: watchlistInput.status } : {}),
        ...(watchlistInput.rating !== undefined ? { rating: watchlistInput.rating } : {}),
        ...(watchlistInput.notes !== undefined ? { notes: watchlistInput.notes } : {}),
      },
    });

    return { watchlistItem };
  };

  public editWatchlistItem = async (
    watchlistInput: EditWatchlistInput,
    watchlistId: string,
    userId: string,
  ) => {
    const watchlistExists = await this.prisma.watchlistItem.findFirst({
      where: { id: watchlistId, userId },
    });
    if (!watchlistExists) {
      throw new AppError("Failed to edit watchlist. Watchlist not found.", 404);
    }

    const watchlistItem = await this.prisma.watchlistItem.update({
      where: { id: watchlistExists.id },
      data: {
        ...(watchlistInput.status !== undefined ? { status: watchlistInput.status } : {}),
        ...(watchlistInput.rating !== undefined ? { rating: watchlistInput.rating } : {}),
        ...(watchlistInput.notes !== undefined ? { notes: watchlistInput.notes } : {}),
      },
    });

    return { watchlistItem };
  };

  public deleteWatchlistItem = async (watchlistId: string, userId: string) => {
    const watchlistExists = await this.prisma.watchlistItem.findFirst({
      where: { id: watchlistId, userId },
    });
    if (!watchlistExists) {
      throw new AppError("Failed to delete watchlist. Watchlist not found.", 404);
    }

    await this.prisma.watchlistItem.delete({
      where: { id: watchlistExists.id },
    });
  };
}
