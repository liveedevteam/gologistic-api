import { check, param } from "express-validator";

export const createOilPriceValidates = [
  check("type")
    .notEmpty()
    .withMessage("Type is required")
    .isString()
    .withMessage("Type must be a string"),
  check("key")
    .notEmpty()
    .withMessage("Key is required")
    .isString()
    .withMessage("Key must be a string"),
];

export const updateOilPriceValidates = [
  param("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("id must be a mongo id"),
  check("type")
    .notEmpty()
    .withMessage("Type is required")
    .isString()
    .withMessage("Type must be a string"),
  check("key")
    .notEmpty()
    .withMessage("Key is required")
    .isString()
    .withMessage("Key must be a string"),
];
