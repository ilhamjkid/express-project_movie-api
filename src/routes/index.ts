import { Router, type Request, type Response } from "express";
import { authRouter } from "#modules/auth/auth.route";
import { movieRouter } from "#modules/movies/movie.route";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy and running.",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRouter);
router.use("/movies", movieRouter);

export { router as apiRouter };
