import express, { NextFunction, Request, Response } from "express";
import { authsRouter } from "./modules/auths/auths.routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";

import "express-async-errors";

import AppError from "./utils/errors/appError";
import connectDb from "./utils/db/connectDb";

export default async (app: any) => {

  connectDb();

  app.use(express.json());

  app.use("/api/auths", authsRouter);

  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Home V" + process.env.VERSION });
  });

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  app.use(globalErrorHandler);
};
