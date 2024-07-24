import Std from "./std.model";
import AppError from "../../utils/errors/appError";
import { Request, Response } from "express";
import { importExcelAndGetData } from "../../utils/uploads/importExcelAndGetData";

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
    .skip((parseInt(page as string) - 1) * parseInt(limit as string));

  const total = await Std.countDocuments();

  res.status(200).json({
    message: "success",
    total,
    totalPerPage: parseInt(limit as string),
    currentPage: parseInt(page as string),
    result: stds,
  });
};
