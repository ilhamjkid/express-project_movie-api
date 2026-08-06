import type { NextFunction, Request, Response } from "express";
import type { MovieService } from "#modules/movies/movie.service";
import { success } from "#utils/response.util";

export class MovieController {
  constructor(private movieService: MovieService) {}

  public addMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.movieService.addMovie(req.validated.body, `${req.user?.userId}`);

      success(res, "Successfully uploaded movie.", 201, result);
    } catch (error) {
      next(error);
    }
  };

  public getMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.movieService.getMovies(req.validated.query);

      success(res, "Successfully get movies.", 200, result);
    } catch (error) {
      next(error);
    }
  };

  public getMovieDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.movieService.getMovieDetails(req.validated.params);

      success(res, "Successfully get movie details.", 200, result);
    } catch (error) {
      next(error);
    }
  };

  public deleteMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.movieService.deleteMovie(req.validated.params);

      success(res, "Successfully delete movie.", 200);
    } catch (error) {
      next(error);
    }
  };

  public editMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.movieService.editMovie(req.validated.params, req.validated.body);

      success(res, "Successfully edit movie.", 200, result);
    } catch (error) {
      next(error);
    }
  };
}
