import express from "express";

const app = express();

app.get("/hello", (_req, res) => {
  res.send({ message: "Hello, World!" });
});

export default app;
