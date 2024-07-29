import { Router } from "express";
import {
  getStdData,
  createStd,
  getStdDataById,
  uploadStdDataFromXlsx,
  updateStd,
} from "./std.controllers";
import tokenAndRoleHandler from "../../middlewares/tokenAndRoleHandler";
import requestValidation from "../../middlewares/validations/requestValidation";
import asyncHandler from "../../utils/errors/asyncHandler";
import { uploadMiddleware } from "../../utils/uploads/multer";

const router = Router();

router.post(
  "/",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(createStd)
);

router.put(
  "/:id",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(updateStd)
);

router.post(
  "/xlsx",
  tokenAndRoleHandler,
  requestValidation,
  uploadMiddleware.single("file"),
  asyncHandler(uploadStdDataFromXlsx)
);

router.get(
  "/:id",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(getStdDataById)
);

router.get(
  "/",
  tokenAndRoleHandler,
  requestValidation,
  asyncHandler(getStdData)
);

const stdsRouter = router;

export { stdsRouter };
