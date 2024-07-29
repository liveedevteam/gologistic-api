import Std from "./std.model";
import AppError from "../../utils/errors/appError";
import { Request, Response } from "express";
import { importExcelAndGetData } from "../../utils/uploads/importExcelAndGetData";

export const createStd = async (req: Request, res: Response) => {
  console.log(`body`, req.body);
  const { peaCode, name, description, unit, price } = req.body;
  const newStd = new Std({
    peaCode,
    name,
    description,
    unit,
    price,
  });
  try {
    await newStd.save();
  } catch (error: any) {
    throw new AppError(error.message, 500);
  }
  res.status(201).json({
    message: "success",
    result: newStd,
  });
};

export const updateStd = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { peaCode, name, description, unit, price } = req.body;
  console.log(`id`, id);
  console.log(`body`, req.body);
  const std = await Std.findById(id);
  if (!std) {
    throw new AppError("No data found", 404);
  }

  std.peaCode = peaCode;
  std.name = name;
  std.description = description;
  std.unit = unit;
  std.price = price;

  try {
    await std.save();
  } catch (error: any) {
    throw new AppError(error.message, 500);
  }

  res.status(200).json({
    message: "success",
    result: std,
  });
};

export const uploadStdDataFromXlsx = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    throw new AppError("No file uploaded", 400);
  }

  console.log(`Received file: ${file?.originalname}`);
  const data = await importExcelAndGetData(file);

  const dataForSave = await Promise.all(
    data.map(async (item: any) => {
      return {
        peaCode: item["PEACode"] || "",
        name: item["Name"] || "",
        description: item["Description"] || "",
        unit: item["Unit"] || "",
        price: item["Price"] || 0,
      };
    })
  );

  const stds = await Std.insertMany(dataForSave);

  res.status(201).json({
    message: "success",
    result: stds,
  });
};

export const getStdData = async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  if (!page || !limit) {
    throw new AppError("Missing page or limit", 400);
  }

  const stds = await Std.find()
    .limit(parseInt(limit as string))
    .skip((parseInt(page as string) - 1) * parseInt(limit as string))
    .sort({ createdAt: -1 });

  const total = await Std.countDocuments();

  res.status(200).json({
    message: "success",
    total,
    totalPerPage: parseInt(limit as string),
    currentPage: parseInt(page as string),
    result: stds,
  });
};

export const getStdDataById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const std = await Std.findById(id);
  if (!std) {
    throw new AppError("No data found", 404);
  }

  res.status(200).json({
    message: "success",
    result: std,
  });
};
