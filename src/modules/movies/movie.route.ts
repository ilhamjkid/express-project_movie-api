import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ httpMethod: "GET" });
});
router.post("/", (_req, res) => {
  res.json({ httpMethod: "POST" });
});

export { router as movieRouter };
