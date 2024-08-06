import { Request, Response, NextFunction } from "express";
import Planning from "./plannings.model";
import AppError from "../../utils/errors/appError";
import Auths from "../auths/models/auths.model";
import User from "../users/models/users.model";
import pushMessage from "../../utils/lines/pushMessage";
import xlsx from "xlsx";
import path from "path";
import OilPrice from "../oilPrices/oilPrice.model";
import Std from "../stds/std.model";
import Stock from "../stocks/stocks.model";
import Weight from "../weights/weights.model";
import { getSignedUrlForGet, uploadToS3 } from "../../utils/aws/uploadToS3";
import dayjs from "dayjs";

const PAGE_DEFAULT = 1;
const LIMIT_DEFAULT = 10;

const validatePagination = (page: string, limit: string) => {
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  if (
    isNaN(pageNumber) ||
    isNaN(limitNumber) ||
    pageNumber < 1 ||
    limitNumber < 1
  ) {
    throw new AppError("Invalid pagination parameters", 400);
  }

  return { pageNumber, limitNumber };
};

const processParcels = async (parcels: any[], oilPricePerLiter: number) => {
  return Promise.all(
    parcels.map(async (item: any) => {
      const [oilPriceDoc, stdDoc, stockDoc, weightDoc] = await Promise.all([
        OilPrice.findOne({
          type: "diesel",
          startPoint: item.source,
          stopPoint: item.destination,
          priceLiter: oilPricePerLiter,
        }),
        Std.findOne({ peaCode: item.peaCode }),
        Stock.findOne({ peaCode: item.peaCode }),
        Weight.findOne({ peaCode: item.peaCode }),
      ]);

      if (!oilPriceDoc || !stdDoc || !stockDoc || !weightDoc) {
        throw new AppError("Required data not found", 404);
      }

      const { centralPrice, centralNumber } = calculateCentralPriceAndNumber(
        item,
        oilPriceDoc
      );

      return {
        ...item,
        centralPrice,
        centralNumber,
        description: stockDoc.description,
        distance: oilPriceDoc.distance,
      };
    })
  );
};

const calculateCentralPriceAndNumber = (item: any, oilPriceDoc: any) => {
  console.log("oilPriceDoc", oilPriceDoc);
  const indexOfTruck = item.numberOfVehicles.findIndex(
    (vehicle: any) => vehicle.number > 0
  );
  console.log("centralPrice", oilPriceDoc.truck[indexOfTruck].value);
  const centralPrice = oilPriceDoc.truck[indexOfTruck].value;
  const centralNumber = item.numberOfVehicles[indexOfTruck].number;
  return { centralPrice, centralNumber };
};

const createExcelFile = (
  title: string,
  parcels: any[],
  oilPricePerLiter: number
) => {
  const xlsxTemplatePath = path.join(
    __dirname,
    "../../../templates/template.xlsx"
  );
  const workbook = xlsx.readFile(xlsxTemplatePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const sheetData = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as any[];
  sheetData[4][13] = oilPricePerLiter;

  parcels.forEach((item: any, index: number) => {
    sheetData.push([
      index + 1,
      item.source,
      item.destination,
      item.distance,
      item.peaCode,
      item.description,
      item.weight,
      item.quantity,
      item.numberOfVehicles[0].number,
      item.numberOfVehicles[1].number,
      item.numberOfVehicles[2].number,
      item.centralPrice,
      item.centralPrice * item.centralNumber,
      "'นับถัดจากใบสั่งจ้าง",
      item.contract,
      item.distance?.value > 800 ? "4" : "3",
    ]);
  });

  const updatedSheet = xlsx.utils.aoa_to_sheet(sheetData);
  workbook.Sheets[sheetName] = updatedSheet;

  return xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
};

export const getPlannings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page = PAGE_DEFAULT, limit = LIMIT_DEFAULT } = req.query as {
    page: string;
    limit: string;
  };

  try {
    const { pageNumber, limitNumber } = validatePagination(
      page.toString(),
      limit.toString()
    );

    const plannings = await Planning.find({})
      .populate("userId")
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const total = await Planning.countDocuments();

    res.status(200).json({
      total,
      totalPerPage: limitNumber,
      currentPage: pageNumber,
      result: plannings,
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

export const getPlanning = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const planning = await Planning.findById(id).populate("userId").lean();

    if (!planning) {
      return next(new AppError("Planning not found", 404));
    }

    const newPlanning = {
      ...planning,
      parcels: await processParcels(
        planning.parcels,
        planning.oilPricePerLiter
      ),
    };

    res.status(200).json(newPlanning);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

export const createPlanning = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, budget, date, oilPricePerLiter, parcels } = req.body;

  try {
    console.log(`Body: ${JSON.stringify(req.body)}`);

    const email = req.user.email;
    const auth = await Auths.findOne({ email });
    const user = await User.findOne({ auth: auth?._id });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const planning = new Planning({
      userId: user._id,
      title,
      budget,
      date,
      oilPricePerLiter,
      parcels,
    });

    await planning.save();

    const updatedParcels = await processParcels(parcels, oilPricePerLiter);
    const buffer = createExcelFile(title, updatedParcels, oilPricePerLiter);

    const originalname = `${title}-${dayjs().format()}.xlsx`;
    const imgObj = (await uploadToS3(originalname, buffer, "planning")) as any;

    planning.xlsxFilename = imgObj.url;
    await planning.updateOne({
      parcels: updatedParcels,
      xlsxFilename: imgObj.key,
    });

    await pushMessage("U9b43a5c487832057d7a1c09536e7d219", [
      {
        type: "text",
        text: `New planning ${title} has been created \n`,
      },
    ]);

    res.status(201).json({ url: imgObj.url });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

export const updatePlanning = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { title, oilPricePerLiter, budget, date, status, parcels } = req.body;

  try {
    console.log(`Body: ${JSON.stringify(req.body)}`);

    const planning = await Planning.findById(id);

    if (!planning) {
      return next(new AppError("Planning not found", 404));
    }

    const isNewStatus = planning.status !== status;

    const updatedPlanning = (await Planning.findByIdAndUpdate(
      id,
      {
        title,
        oilPricePerLiter,
        budget,
        date,
        status,
        parcels,
        updatedAt: new Date(),
      },
      { new: true }
    )) as any;

    if (!updatedPlanning) {
      return next(new AppError("Failed to update planning", 500));
    }

    if (isNewStatus) {
      let statusText = "";
      switch (status) {
        case "inProgress":
          statusText = "แผนจ้างขนส่ง";
          break;
        case "proposal":
          statusText = "ใบเสนอราคา ";
          break;
        case "comparePrice":
          statusText = "เปรียบเทียบราคา";
          break;
        case "completed":
          statusText = "ขออนุมัติจ้าง";
          break;
        default:
          statusText = "Draft";
          break;
      }
      await pushMessage("U9b43a5c487832057d7a1c09536e7d219", [
        {
          type: "text",
          text: `Planning ${title} has been updated to ${statusText}`,
        },
      ]);
    }

    // Generate new excel file
    const updatedParcels = await processParcels(
      updatedPlanning.parcels,
      updatedPlanning.oilPricePerLiter
    );
    const buffer = createExcelFile(title, updatedParcels, oilPricePerLiter);

    const originalname = `${title}-${dayjs().format()}.xlsx`;
    const imgObj = (await uploadToS3(originalname, buffer, "planning")) as any;
    updatedPlanning.xlsxFilename = imgObj.key;

    await updatedPlanning.updateOne({
      oilPricePerLiter,
      parcels: updatedParcels,
      xlsxFilename: imgObj.key,
    });

    res.status(200).json(updatedPlanning);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

export const downloadExcelOfPlanning = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const planning = await Planning.findById(id).lean();

    if (!planning) {
      return next(new AppError("Planning not found", 404));
    }

    const signedUrl = await getSignedUrlForGet({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: planning.xlsxFilename,
    });

    res.status(200).json({ url: signedUrl });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};
