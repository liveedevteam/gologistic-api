import { Router } from "express";

import { uploadOilPriceDataFromExcel } from "./oilPrice.controllers";
import tokenAndRoleHandler from "../../middlewares/tokenAndRoleHandler";
import requestValidation from "../../middlewares/validations/requestValidation";
import { uploadMiddleware } from "../../utils/uploads/multer";
import asyncHandler from "../../utils/errors/asyncHandler";

const router = Router();

router.post(
  "/:type/xlsx",
  tokenAndRoleHandler,
  requestValidation,
  uploadMiddleware.single("file"),
  asyncHandler(uploadOilPriceDataFromExcel)
);

const oilPriceRouter = router;

export { oilPriceRouter };