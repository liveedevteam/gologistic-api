import { check, header } from "express-validator";

const { ADMIN_API_KEY } = process.env;

export const loginValidation = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const registerValidation = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string"),
  check("role")
    .not()
    .isEmpty()
    .isIn(["admin", "user"])
    .withMessage("Name is required"),
];

export const superAdminValidation = [
  header("x-api-key")
    .notEmpty()
    .withMessage("x-api-key is required")
    .isString()
    .withMessage("x-api-key must be a string")
    .custom((value) => {
      if (value !== ADMIN_API_KEY) {
        throw new Error("Invalid x-api-key");
      }
      return true;
    }),
];

export const tokenValidation = [
  header("Authorization")
    .notEmpty()
    .withMessage("Authorization is required")
    .isString()
    .withMessage("Authorization")
    .custom((value) => {
      if (!value.startsWith("Bearer ")) {
        throw new Error("Invalid authorization format");
      }
      return true;
    }),
];