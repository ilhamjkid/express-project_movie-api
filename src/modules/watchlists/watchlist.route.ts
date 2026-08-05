import { Router } from "express";
import { prisma } from "#config/db.config";
import { WatchlistService } from "#modules/watchlists/watchlist.service";
import { WatchlistController } from "#modules/watchlists/watchlist.controller";
import {
  addWatchlistBodySchema,
  editOrDeleteWatchlistParamsSchema,
  editWatchlistBodySchema,
  getWatchlistItemsQuerySchema,
} from "#modules/watchlists/watchlist.dto";
import { validate } from "#middleware/validate.middleware";
import { authenticate } from "#middleware/auth.middleware";
import { JwtUtil } from "#utils/jwt.util";

const router = Router();

const jwtUtil = new JwtUtil();
const watchlistService = new WatchlistService(prisma);
const watchlistController = new WatchlistController(watchlistService);

router.use(authenticate(prisma, jwtUtil));
router.post("/", validate(addWatchlistBodySchema), watchlistController.addWatchlistItem);
router.get(
  "/",
  validate(getWatchlistItemsQuerySchema, "query"),
  watchlistController.getWatchlistItems,
);
router.delete(
  "/:id",
  validate(editOrDeleteWatchlistParamsSchema, "params"),
  watchlistController.deleteWatchlistItem,
);
router.put(
  "/:id",
  validate(editOrDeleteWatchlistParamsSchema, "params"),
  validate(editWatchlistBodySchema),
  watchlistController.editWatchlistItem,
);

export { router as watchlistRouter };
