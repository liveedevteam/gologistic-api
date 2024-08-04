import { Router } from "express";
import {
  createParcel,
  getParcel,
  getParcels,
  updateParcel,
} from "./parcels.controller";
import tokenAndRoleHandler from "../../middlewares/tokenAndRoleHandler";
import requestValidation from "../../middlewares/validations/requestValidation";
import asyncHandler from "../../utils/errors/asyncHandler";

const router = Router();

router.get(
  "/:id",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(getParcel)
);
router.put(
  "/:id",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(updateParcel)
);
router.post(
  "/",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(createParcel)
);
router.get(
  "/",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(getParcels)
);

const parcelsRouter = router;

export { parcelsRouter };
