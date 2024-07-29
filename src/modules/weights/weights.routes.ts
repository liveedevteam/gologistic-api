import { Router } from "express";
import tokenAndRoleHandler from "../../middlewares/tokenAndRoleHandler";
import requestValidation from "../../middlewares/validations/requestValidation";
import {
  createWeightData,
  getWeightData,
  updateWeightData,
  uploadWeightDataFromXlsx,
} from "./weights.controllers";
import { uploadMiddleware } from "../../utils/uploads/multer";
import asyncHandler from "../../utils/errors/asyncHandler";

const router = Router();

router.post(
  "/xlsx",
  tokenAndRoleHandler,
  requestValidation,
  uploadMiddleware.single("file"),
  asyncHandler(uploadWeightDataFromXlsx)
);

router.put(
  "/:id",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(updateWeightData)
);

router.post(
  "/",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(createWeightData)
);

router.get(
  "/",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(getWeightData)
);

const weightsRouter = router;

export { weightsRouter };
