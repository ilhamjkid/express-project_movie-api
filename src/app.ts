import express from "express";
import cookieParser from "cookie-parser";
import { apiRouter } from "#routes";
import { globalErrorHandler, notFoundHandler } from "#middleware/error.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", apiRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
