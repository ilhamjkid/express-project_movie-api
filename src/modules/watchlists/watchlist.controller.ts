import type { NextFunction, Request, Response } from "express";
import type { WatchlistService } from "#modules/watchlists/watchlist.service";
import { AppError } from "#errors/app.error";
import { sendSuccessResponse } from "#utils/response.util";

export class WatchlistController {
  constructor(private watchlistService: WatchlistService) {}

  public addWatchlistItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError("Failed to add to watchlist. Unauthorized User.", 401);
      const result = await this.watchlistService.addWatchlistItem(req.body, userId);
      sendSuccessResponse(res, "Successfully added to your watchlist.", 201, result);
    } catch (error) {
      next(error);
    }
  };
}
