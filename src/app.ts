import express from "express";
import movieRoutes from "#modules/movies/movie.routes";

const app = express();

app.use("/api/movies", movieRoutes);

export default app;
