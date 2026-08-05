import type { NextFunction, Request, Response } from "express";
import type { WatchlistService } from "#modules/watchlists/watchlist.service";
import { success } from "#utils/response.util";

export class WatchlistController {
  constructor(private watchlistService: WatchlistService) {}

  public addWatchlistItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.watchlistService.addWatchlistItem(
        req.validated.body,
        `${req.user?.userId}`,
      );

      success(res, "Successfully added to your watchlist.", 201, result);
    } catch (error) {
      next(error);
    }
  };

  public getWatchlistItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.watchlistService.getWatchlistItems(
        req.validated.query,
        `${req.user?.userId}`,
      );

      success(res, "Successfully get watchlist items.", 200, result);
    } catch (error) {
      next(error);
    }
  };

  public deleteWatchlistItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.watchlistService.deleteWatchlistItem(req.validated.params, `${req.user?.userId}`);

      success(res, "Successfully deleted watchlist.", 200);
    } catch (error) {
      next(error);
    }
  };

  public editWatchlistItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.watchlistService.editWatchlistItem(
        req.validated.params,
        req.validated.body,
        `${req.user?.userId}`,
      );

      success(res, "Successfully edited watchlist.", 200, result);
    } catch (error) {
      next(error);
    }
  };
}
