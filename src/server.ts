import express, { NextFunction, Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";

import "express-async-errors";

import AppError from "./utils/errors/appError";
import connectDb from "./utils/db/connectDb";

import { authsRouter } from "./modules/auths/auths.routes";
import { usersRouter } from "./modules/users/users.routes";
import { shippingPlansRouter } from "./modules/shippingPlans/shippingPlans.routes";
import { weightsRouter } from "./modules/weights/weights.routes";
import { stocksRouter } from "./modules/stocks/stocks.routes";
import { stdsRouter } from "./modules/stds/std.routes";
import { oilPriceRouter } from "./modules/oilPrices/oilPrice.routes";

export default async (app: any) => {
  connectDb();

  app.use(express.json());

  app.use("/api/auths", authsRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/shipping-plans", shippingPlansRouter);
  app.use("/api/weights", weightsRouter);
  app.use("/api/stocks", stocksRouter);
  app.use("/api/stds", stdsRouter);
  app.use("/api/oil-prices", oilPriceRouter);

  app.get("/health", (req: Request, res: Response) => {
    res.json({ message: "OK" });
  });
  
  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Home V" + process.env.VERSION });
  });

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  app.use(globalErrorHandler);
};
