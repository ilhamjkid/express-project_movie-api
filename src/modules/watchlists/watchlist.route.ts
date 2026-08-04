import { Router } from "express";
import { prisma } from "#config/db.config";
import { WatchlistService } from "#modules/watchlists/watchlist.service";
import { WatchlistController } from "#modules/watchlists/watchlist.controller";
import { editWatchlistSchema, watchlistSchema } from "#modules/watchlists/watchlist.dto";
import { validate } from "#middleware/validate.middleware";
import { authenticate } from "#middleware/auth.middleware";

const router = Router();

const watchlistService = new WatchlistService(prisma);
const watchlistController = new WatchlistController(watchlistService);

router.use(authenticate);
router.post("/", validate(watchlistSchema), watchlistController.addWatchlistItem);
router.put("/:id", validate(editWatchlistSchema), watchlistController.editWatchlistItem);
router.delete("/:id", watchlistController.deleteWatchlistItem);

export { router as watchlistRouter };
