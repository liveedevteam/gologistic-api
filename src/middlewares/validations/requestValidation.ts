import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import AppError from "../../utils/errors/appError";

const requestValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  console.log(`requestValidation:`, errors.array());
  if (!errors.isEmpty()) {
    let errorMessages = errors.array().map((error) => error.msg);
    if (errorMessages.length > 1) {
      const message = errorMessages.join(", ");
      return next(new AppError(message, 400));
    }
    return next(new AppError(errorMessages[0], 400));
  }
  next();
};

export default requestValidation;
