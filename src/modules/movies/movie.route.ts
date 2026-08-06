import { Router } from "express";
import { prisma } from "#config/db.config";
import { authenticate } from "#middleware/auth.middleware";
import { authorize } from "#middleware/authorize.middleware";
import { validate } from "#middleware/validate.middleware";
import { JwtUtil } from "#utils/jwt.util";
import { MovieService } from "#modules/movies/movie.service";
import { MovieController } from "#modules/movies/movie.controller";
import {
  addOrEditMovieBodySchema,
  getMoviesQuerySchema,
  handleSingleMovieParamsSchema,
} from "#modules/movies/movie.dto";

const router = Router();

const jwtUtil = new JwtUtil();
const movieService = new MovieService(prisma);
const movieController = new MovieController(movieService);

router.use(authenticate(prisma, jwtUtil));
router.post(
  "/",

  authorize("ADMIN"),
  validate(addOrEditMovieBodySchema),
  movieController.addMovie,
);
router.get("/", validate(getMoviesQuerySchema, "query"), movieController.getMovies);
router.get(
  "/:id",
  validate(handleSingleMovieParamsSchema, "params"),
  movieController.getMovieDetails,
);
router.delete(
  "/:id",
  authorize("ADMIN"),
  validate(handleSingleMovieParamsSchema, "params"),
  movieController.deleteMovie,
);
router.put(
  "/:id",
  authorize("ADMIN"),
  validate(handleSingleMovieParamsSchema, "params"),
  validate(addOrEditMovieBodySchema),
  movieController.editMovie,
);

export { router as movieRouter };
