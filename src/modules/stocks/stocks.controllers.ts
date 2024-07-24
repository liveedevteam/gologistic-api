import AppError from "../../utils/errors/appError";
import { importExcelAndGetData } from "../../utils/uploads/importExcelAndGetData";
import Stock from "./stocks.model";
import { Request, Response } from "express";

export const uploadStockDataFromXlsx = async (req: Request, res: Response) => {
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
        idCode: item["IDCode"] || "",
        engName: item["EngName"] || "",
        thaiName: item["ThaiName"] || "",
        package: item["Package"] || "",
        description: item["Description"] || "",
        unit: item["Unit"] || "",
      };
    })
  );

  const stocks = await Stock.insertMany(dataForSave);

  res.status(201).json({
    status: "success",
    data: stocks,
  });
};
