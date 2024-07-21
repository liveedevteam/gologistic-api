import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello World User" });
});

const usersRouter = router;

export { usersRouter };
