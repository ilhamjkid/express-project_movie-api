import type { PrismaClient } from "#prisma/client";
import type { WatchlistInput } from "#modules/watchlists/watchlist.dto";
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
      data: { userId, ...watchlistInput },
    });

    return { watchlistItem };
  };
}
