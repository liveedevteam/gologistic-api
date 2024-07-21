import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Shipping Plans");
});

const shippingPlansRouter = router;

export { shippingPlansRouter };
