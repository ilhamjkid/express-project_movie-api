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

  public editWatchlistItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError("Failed to edit watchlist. Unauthorized User.", 401);
      const watchlistId = req.params.id;
      if (typeof watchlistId !== "string" || watchlistId.trim() === "") {
        throw new AppError("Failed to edit watchlist. Invalid ID parameter.", 400);
      }
      const result = await this.watchlistService.editWatchlistItem(req.body, watchlistId, userId);
      sendSuccessResponse(res, "Successfully edited watchlist.", 200, result);
    } catch (error) {
      next(error);
    }
  };

  public deleteWatchlistItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError("Failed to delete watchlist. Unauthorized User.", 401);
      const watchlistId = req.params.id;
      if (typeof watchlistId !== "string" || watchlistId.trim() === "") {
        throw new AppError("Failed to delete watchlist. Invalid ID parameter.", 400);
      }
      await this.watchlistService.deleteWatchlistItem(watchlistId, userId);
      sendSuccessResponse(res, "Successfully deleted watchlist.", 200);
    } catch (error) {
      next(error);
    }
  };
}
