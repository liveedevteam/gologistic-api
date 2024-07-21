import { Router } from "express";
import {
  createShippingPlan,
  deleteShippingPlan,
  getShippingPlans,
  getShippingPlanById,
  updateShippingPlan,
  createShippingOrder,
} from "./shippingPlans.controllers";
import asyncHandler from "../../utils/errors/asyncHandler";
import tokenAndRoleHandler from "../../middlewares/tokenAndRoleHandler";
import requestValidation from "../../middlewares/validations/requestValidation";
import { createShippingOrderValidates, createShippingPlanValidates } from "../../middlewares/validations/shippingValidation";

const router = Router();

router.post("/order/:orderId/plan", 
  tokenAndRoleHandler,
  createShippingPlanValidates,
  requestValidation,
  asyncHandler(createShippingPlan));
router.post(
  "/order",
  tokenAndRoleHandler,
  createShippingOrderValidates,
  requestValidation,
  asyncHandler(createShippingOrder)
);
router.delete("/:id", asyncHandler(deleteShippingPlan));
router.patch("/", asyncHandler(updateShippingPlan));
router.post("/", asyncHandler(createShippingPlan));
router.get("/:id", asyncHandler(getShippingPlanById));
router.get("/", asyncHandler(getShippingPlans));

const shippingPlansRouter = router;

export { shippingPlansRouter };
