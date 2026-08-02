import { Router } from "express";
import { prisma } from "#config/db.config";
import { WatchlistService } from "#modules/watchlists/watchlist.service";
import { WatchlistController } from "#modules/watchlists/watchlist.controller";
import { watchlistSchema } from "#modules/watchlists/watchlist.dto";
import { validate } from "#middleware/validate.middleware";

const router = Router();

const watchlistService = new WatchlistService(prisma);
const watchlistController = new WatchlistController(watchlistService);

router.post("/", validate(watchlistSchema), watchlistController.addWatchlistItem);

export { router as watchlistRouter };
