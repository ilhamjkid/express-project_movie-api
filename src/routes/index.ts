import { Router } from "express";
import { movieRouter } from "#modules/movies/movie.route";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy an running",
    timestamp: new Date().toISOString(),
  });
});

router.use("/movies", movieRouter);

export { router as apiRouter };
