import { Router } from "express";
import { login, register, verify } from "./auths.controllers";
import asyncHandler from "../../utils/errors/asyncHandler";
import requestValidation from "../../middlewares/validations/requestValidation";
import {
  loginValidation,
  registerValidation,
  superAdminValidation,
} from "../../middlewares/validations/authValidation";

const router = Router();

router.post("/login", loginValidation, requestValidation, asyncHandler(login));
router.post(
  "/register",
  superAdminValidation,
  registerValidation,
  requestValidation,
  asyncHandler(register)
);
router.get("/verify", requestValidation, asyncHandler(verify));
router.get("/", (req, res) => {
  res.json({ message: "Hello World Auth Modules" });
});

const authsRouter = router;

export { authsRouter };
