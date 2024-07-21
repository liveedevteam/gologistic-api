import { NextFunction, Request, Response } from "express";
import { verifyTokenService } from "../modules/auths/services/auths.services";
import AppError from "../utils/errors/appError";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.header("Authorization");

    if (!authorization) {
      throw new AppError("Unauthorized", 401);
    }

    const token = authorization.split(" ")[1];
    const decoded = (await verifyTokenService(token)) as {
      sub: string;
      role: string;
      iat: number;
      exp: number;
    };

    if (!decoded) {
      throw new AppError("Unauthorized", 401);
    }
    
    req.user = {
      email: decoded.sub,
      role: decoded.role,
      iat: decoded.iat,
      exp: decoded.exp,
    };
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
