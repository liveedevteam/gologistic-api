import { Request, Response } from "express";
import { importExcelAndGetData } from "../../utils/uploads/importExcelAndGetData";
import AppError from "../../utils/errors/appError";

import Weight from "./weights.model";

export const uploadWeightDataFromXlsx = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    throw new AppError("No file uploaded", 400);
  }

  console.log(`Received file: ${file?.originalname}`);
  const data = await importExcelAndGetData(file);

  const dataForSave = await Promise.all(
    data.map(async (item: any) => {
      let weight = 0;
      let totalWeight = 0;

      // Validate and parse weight
      if (typeof item["Weight"] === "string") {
        weight = parseInt(item["Weight"].replace(/,/g, ""));
        if (isNaN(weight)) weight = 0;
      } else if (typeof item["Weight"] === "number") {
        weight = item["Weight"];
      } else {
        weight = 0;
      }

      // Validate and parse totalWeight
      if (typeof item["TotalWeight"] === "string") {
        totalWeight = parseInt(item["TotalWeight"].replace(/,/g, ""));
        if (isNaN(totalWeight)) totalWeight = 0;
      } else if (typeof item["TotalWeight"] === "number") {
        totalWeight = item["TotalWeight"];
      }

      // Convert weights to correct unit (multiply by 100)
      weight *= 100;
      totalWeight *= 100;

      return {
        peaCode: item["PEACode"] || "",
        description: item["Description"] || "",
        unit: item["Unit"] || "",
        weight: weight,
        package: item["Package"] || "",
        totalWeight: totalWeight,
        trucks: [
          {
            name: "Truck06",
            value: item["Truck06"] || "",
          },
          {
            name: "Truck10",
            value: item["Truck10"] || "",
          },
          {
            name: "Truck18",
            value: item["Truck18"] || "",
          },
        ],
        remark: item["Remark"] || "",
      };
    })
  );

  await Weight.insertMany(dataForSave);

  return res.status(200).json({
    message: "Data uploaded successfully",
    result: dataForSave,
  });
};

export const getWeightData = async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  if (!page || !limit) {
    throw new AppError("Missing page or limit", 400);
  }

  const weights = await Weight.find()
    .limit(parseInt(limit as string))
    .skip((parseInt(page as string) - 1) * parseInt(limit as string));

  const total = await Weight.countDocuments();

  res.status(200).json({
    message: "success",
    total,
    totalPerPage: parseInt(limit as string),
    currentPage: parseInt(page as string),
    result: weights,
  });
};

export const createWeightData = async (req: Request, res: Response) => {
  const {
    peaCode,
    description,
    unit,
    weight,
    package: package_,
    totalWeight,
    trucks,
    remark,
  } = req.body;

  const weightData = await Weight.create({
    peaCode,
    description,
    unit,
    weight,
    package: package_,
    totalWeight,
    trucks,
    remark,
  });

  res.status(200).json({
    message: "success",
    result: weightData,
  });
};

export const updateWeightData = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    peaCode,
    description,
    unit,
    weight,
    package: package_,
    totalWeight,
    trucks,
    remark,
  } = req.body;

  const weightData = await Weight.findByIdAndUpdate(
    id,
    {
      peaCode,
      description,
      unit,
      weight,
      package: package_,
      totalWeight,
      trucks,
      remark,
    },
    { new: true }
  );

  res.status(200).json({
    message: "success",
    result: weightData,
  });
};
