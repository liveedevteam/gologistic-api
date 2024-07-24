import { Router } from "express";
import { uploadStdDataFromXlsx } from "./std.controllers";
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
  asyncHandler(uploadStdDataFromXlsx)
);

const stdsRouter = router;

export { stdsRouter };