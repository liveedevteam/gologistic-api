import { Router } from "express";

import { uploadStockDataFromXlsx } from "./stocks.controllers";
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

const stocksRouter = router;

export { stocksRouter };
