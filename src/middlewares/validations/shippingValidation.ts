import { check, param } from "express-validator";

export const createShippingOrderValidates = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 6 })
    .withMessage("Name must be at least 6 characters long"),
  check("planningNumber")
    .notEmpty()
    .withMessage("planningNumber string is required")
    .isString()
    .withMessage("planningNumber string must be a string")
    .isLength({ min: 6 })
    .withMessage("planningNumber number must be at least 6 characters long"),
  check("createdBy")
    .notEmpty()
    .withMessage("Created by is required")
    .isMongoId()
    .withMessage("Created by must be a mongo id"),
  check("status")
    .notEmpty()
    .withMessage("Status is required")
    .isString()
    .withMessage("Status must be a string")
    .isIn([
      "todo",
      "in-progress",
      "completed",
      "cancelled",
      "returned",
      "delivered",
    ])
    .withMessage("Status must be either active or inactive"),
];

export const createShippingPlanValidates = [
  param("orderId")
    .notEmpty()
    .withMessage("orderId is required")
    .isMongoId()
    .withMessage("orderId must be a mongo id"),
  check("routeStart")
    .notEmpty()
    .withMessage("Route start is required")
    .isString()
    .withMessage("Route start must be a string"),
  check("routeEnd")
    .notEmpty()
    .withMessage("Route end is required")
    .isArray()
    .withMessage("Route end must be an array"),
  check("fuelCost")
    .notEmpty()
    .withMessage("Fuel cost is required")
    .isNumeric()
    .withMessage("Fuel cost must be a number"),
  check("vehicleType")
    .notEmpty()
    .withMessage("Vehicle type is required")
    .isString()
    .withMessage("Vehicle type must be a string"),
  check("vehicleCount")
    .notEmpty()
    .withMessage("Vehicle count is required")
    .isNumeric()
    .withMessage("Vehicle count must be a number"),
  check("packageCode")
    .notEmpty()
    .withMessage("Package code is required")
    .isString()
    .withMessage("Package code must be a string"),
  check("packageCount")
    .notEmpty()
    .withMessage("Package count is required")
    .isNumeric()
    .withMessage("Package count must be a number"),
  check("distributionPlan")
    .notEmpty()
    .withMessage("Distribution plan is required")
    .isString()
    .withMessage("Distribution plan must be a string"),
  check("purchaseBudget")
    .notEmpty()
    .withMessage("Purchase budget is required")
    .isNumeric()
    .withMessage("Purchase budget must be a number"),
  check("commission")
    .notEmpty()
    .withMessage("Commission is required")
    .isNumeric()
    .withMessage("Commission must be a number"),
  check("packageReceivedDate")
    .notEmpty()
    .withMessage("Package received date is required")
    .isDate()
    .withMessage("Package received date must be a date"),
  check("status")
    .notEmpty()
    .withMessage("Status is required")
    .isString()
    .withMessage("Status must be a string")
    .isIn(["open", "close"])
    .withMessage("Status must be either active or inactive"),
];
