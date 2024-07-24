import OilPrice from "./oilPrice.model";
import { Request, Response } from "express";
import { importExcelAndGetData } from "../../utils/uploads/importExcelAndGetData";
import AppError from "../../utils/errors/appError";

export const uploadOilPriceDataFromExcel = async (
  req: Request,
  res: Response
) => {
  const file = req.file;
  const { type } = req.params;
  console.log("type", type);
  if (!file) {
    throw new AppError("No file uploaded", 400);
  }

  if (!type) {
    throw new AppError("No type specified", 400);
  }

  console.log(`Received file: ${file?.originalname}`);
  const data = await importExcelAndGetData(file);

  const dataForSave = await Promise.all(
    data.map(async (item: any) => {
      let priceTruck = 0;
      let distance = 0;

      if (typeof item["PriceTruck"] === "string") {
        priceTruck = parseInt(item["PriceTruck"].replace(/,/g, ""));
        if (isNaN(priceTruck)) priceTruck = 0;
      } else if (typeof item["PriceTruck"] === "number") {
        priceTruck = item["PriceTruck"];
      } else {
        priceTruck = 0;
      }

      if (typeof item["Distance"] === "string") {
        distance = parseInt(item["Distance"].replace(/,/g, ""));
        if (isNaN(distance)) distance = 0;
      } else if (typeof item["Distance"] === "number") {
        distance = item["Distance"];
      } else {
        distance = 0;
      }

      priceTruck = priceTruck * 100;

      return {
        type: type,
        key: item["NewKey"] || "",
        startPoing: item[" StartPoint"] || "",
        startGps: item["StartGPS"] || "",
        stopPoint: item["StopPoint"] || "",
        stopGps: item["StopGPS"] || "",
        priceLiter: item["PriceLiter"] || 0,
        distance,
        truck: [
          {
            name: "Truck08",
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
          priceTruck,
        ],
      };
    })
  );

  const oilPrices = await OilPrice.insertMany(dataForSave);

  res.status(201).json({
    message: "success",
    data: oilPrices,
  });
};

export const getOilPriceData = async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  if (!page || !limit) {
    throw new AppError("Please provide page and limit query params", 400);
  }

  const oilPrices = await OilPrice.find()
    .skip((parseInt(page as string) - 1) * parseInt(limit as string))
    .limit(parseInt(limit as string));

  const total = await OilPrice.countDocuments();

  res.status(200).json({
    message: "success",
    total,
    totalPerPage: parseInt(limit as string),
    currentPage: parseInt(page as string),
    data: oilPrices,
  });
};
