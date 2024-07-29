import { Router } from "express";

import {
  createStockData,
  getStockData,
  updateStockData,
  uploadStockDataFromXlsx,
} from "./stocks.controllers";
import tokenAndRoleHandler from "../../middlewares/tokenAndRoleHandler";
import requestValidation from "../../middlewares/validations/requestValidation";
import asyncHandler from "../../utils/errors/asyncHandler";
import { uploadMiddleware } from "../../utils/uploads/multer";

const router = Router();

router.post(
  "/xlsx",
  tokenAndRoleHandler,
  requestValidation,
  uploadMiddleware.single("file"),
  asyncHandler(uploadStockDataFromXlsx)
);

router.put(
  "/:id",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(updateStockData)
);

router.post(
  "/",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(createStockData)
);

router.get(
  "/",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(getStockData)
);

const stocksRouter = router;

export { stocksRouter };
