import { Router } from "express";

import {
  getOilPriceData,
  getStartAndStopPoints,
  uploadOilPriceDataFromExcel,
} from "./oilPrice.controllers";
import tokenAndRoleHandler from "../../middlewares/tokenAndRoleHandler";
import requestValidation from "../../middlewares/validations/requestValidation";
import { uploadMiddleware } from "../../utils/uploads/multer";
import asyncHandler from "../../utils/errors/asyncHandler";
import {
  createOilPriceValidates,
  updateOilPriceValidates,
} from "../../middlewares/validations/createOilPriceValidation";

const router = Router();

router.get(
  "/location/start-stop",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(getStartAndStopPoints)
);

router.post(
  "/:type/xlsx",
  tokenAndRoleHandler,
  requestValidation,
  uploadMiddleware.single("file"),
  asyncHandler(uploadOilPriceDataFromExcel)
);

router.post(
  "/",
  tokenAndRoleHandler,
  createOilPriceValidates,
  requestValidation,
  asyncHandler(uploadOilPriceDataFromExcel)
);

router.put(
  "/:id",
  tokenAndRoleHandler,
  updateOilPriceValidates,
  requestValidation,
  asyncHandler(uploadOilPriceDataFromExcel)
);

router.get(
  "/",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(getOilPriceData)
);

const oilPriceRouter = router;

export { oilPriceRouter };
