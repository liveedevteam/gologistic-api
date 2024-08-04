import { Request, Response } from "express";
import Parcel from "./parcels.model";
import AppError from "../../utils/errors/appError";
import Auths from "../auths/models/auths.model";

export const createParcel = async (req: Request, res: Response) => {
  const {
    oilPrice,
    source,
    destination,
    parcelCode,
    parcelAmount,
    parcelType,
    vehicleAmount,
    ratio,
    proportion,
    receiveDate,
  } = req.body;
  const email = req.user.email;
  const auth = await Auths.findOne({
    email,
  });
  const userId = auth?._id;
  console.log(`userId`, userId);
  const parcel = new Parcel({
    oilPrice,
    source,
    destination,
    parcelCode,
    parcelAmount,
    parcelType,
    vehicleAmount,
    ratio,
    proportion,
    receiveDate,
    userId,
  });
  await parcel.save();
  res.status(201).json(parcel);
};

export const getParcels = async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  if (!page || !limit) new AppError("Please provide page and limit", 400);

  try {
    const parcels = await Parcel.find()
      .limit(limit as unknown as number)
      .skip((page as unknown as number) * (limit as unknown as number))
      .sort({ createdAt: -1 });

    res.status(200).json(parcels);
  } catch (error: any) {
    new AppError(error.message, 400);
  }
};

export const getParcel = async (req: Request, res: Response) => {
  try {
    const parcel = await Parcel.findById(req.params.id);

    if (!parcel) new AppError("Parcel not found", 404);

    res.status(200).json(parcel);
  } catch (error: any) {
    new AppError(error.message, 400);
  }
};

export const updateParcel = async (req: Request, res: Response) => {
  try {
    const parcel = await Parcel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!parcel) new AppError("Parcel not found", 404);

    res.status(200).json(parcel);
  } catch (error: any) {
    new AppError(error.message, 400);
  }
};

export const deleteParcel = async (req: Request, res: Response) => {
  try {
    const parcel = await Parcel.findByIdAndDelete(req.params.id);

    if (!parcel) new AppError("Parcel not found", 404);

    res.status(204).json();
  } catch (error: any) {
    new AppError(error.message, 400);
  }
};

export const getParcelsByUser = async (req: Request, res: Response) => {
  try {
    const parcels = await Parcel.find({ userId: req.params.userId });

    res.status(200).json(parcels);
  } catch (error: any) {
    new AppError(error.message, 400);
  }
};
