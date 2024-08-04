import { Router } from "express";
import tokenAndRoleHandler from "../../middlewares/tokenAndRoleHandler";
import requestValidation from "../../middlewares/validations/requestValidation";
import asyncHandler from "../../utils/errors/asyncHandler";
import { createPlanning, getPlanning, getPlannings } from "./plannings.controller";

const router = Router();

router.get(
  "/:id",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(getPlanning)
);

router.post(
  "/",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(createPlanning)
);

router.get(
  "/",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(getPlannings)
);

const planningsRouter = router;

export { planningsRouter };
