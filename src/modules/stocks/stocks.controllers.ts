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
    result: stocks,
  });
};

export const getStockData = async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  if (!page || !limit) {
    throw new AppError("Missing page or limit", 400);
  }

  const stocks = await Stock.find()
    .limit(parseInt(limit as string))
    .skip((parseInt(page as string) - 1) * parseInt(limit as string));

  const total = await Stock.countDocuments();

  res.status(200).json({
    status: "success",
    total,
    totalPerPage: parseInt(limit as string),
    currentPage: parseInt(page as string),
    result: stocks,
  });
};

export const createStockData = async (req: Request, res: Response) => {
  const {
    peaCode,
    idCode,
    engName,
    thaiName,
    package: package_,
    description,
    unit,
  } = req.body;

  const stock = await Stock.create({
    peaCode,
    idCode,
    engName,
    thaiName,
    package: package_,
    description,
    unit,
  });

  res.status(200).json({
    status: "success",
    result: stock,
  });
};

export const updateStockData = async (req: Request, res: Response) => {
  const {
    peaCode,
    idCode,
    engName,
    thaiName,
    package: package_,
    description,
    unit,
  } = req.body;

  const stock = await Stock.findByIdAndUpdate(
    req.params.id,
    {
      peaCode,
      idCode,
      engName,
      thaiName,
      package: package_,
      description,
      unit,
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    result: stock,
  });
};

export const getStockDataByPeaCode = async (req: Request, res: Response) => {
  const { peaCode } = req.params;

  const stock = await Stock.findOne({ peaCode });

  res.status(200).json({
    status: "success",
    result: stock,
  });
};
