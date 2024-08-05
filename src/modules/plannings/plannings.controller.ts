import { Request, Response } from "express";
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
import { uploadToS3 } from "../../utils/aws/uploadToS3";
import dayjs from "dayjs";

export const getPlannings = async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  if (!page || !limit) new AppError("Please provide page and limit", 400);

  try {
    const plannings = await Planning.find({})
      .populate("userId")
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(limit as unknown as number)
      .sort({ createdAt: -1 });
    // console.log(`plannings`, plannings);
    const total = await Planning.countDocuments();
    const objRes = {
      total,
      totalPerPage: limit,
      currentPage: page,
      result: plannings,
    };

    res.status(200).json(objRes);
  } catch (error: any) {
    new AppError(error.message, 400);
  }
};

export const getPlanning = async (req: Request, res: Response) => {
  const { id } = req.params;

  const planning = (await Planning.findOne({ _id: id }).populate(
    "userId"
  )) as any;
  if (!planning) new AppError("Planning not found", 404);
  const planningObj = planning.toObject();

  // console.log(`planning`, planning);
  res.status(200).json(planningObj);
};

export const createPlanning = async (req: Request, res: Response) => {
  const { title, budget, date, oilPricePerLiter, parcels } = req.body;
  console.log(`Body`, JSON.stringify(req.body));
  const email = req.user.email;
  const auth = await Auths.findOne({ email });
  const user = await User.findOne({
    auth: auth?._id,
  });
  const userId = user?._id;
  // console.log(`userId`, userId);
  const planning = await Planning.create({
    userId,
    title,
    budget,
    date,
    oilPricePerLiter: oilPricePerLiter,
    parcels,
  });
  const xlsxTemplatePath = path.join(
    __dirname,
    "../../../templates/template.xlsx"
  );
  const workbook = xlsx.readFile(xlsxTemplatePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const sheetData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  const newParcels = await Promise.all(
    parcels.map(async (item: any) => {
      const oilPriceDoc = await OilPrice.findOne({
        type: "diesel",
        startPoint: `${item.source}`,
        stopPoint: `${item.destination}`,
        priceLiter: oilPricePerLiter,
      });
      item.distance = oilPriceDoc?.distance;

      if (!oilPriceDoc) throw new AppError("Oil price not found", 404);

      const stdDoc = await Std.findOne({
        peaCode: item.peaCode,
      });

      if (!stdDoc) throw new AppError("Std not found", 404);

      const stockDoc = await Stock.findOne({
        peaCode: item.peaCode,
      });

      if (!stockDoc) throw new AppError("Stock not found", 404);

      const weightDoc = await Weight.findOne({
        peaCode: item.peaCode,
      });
      console.log(`weightDoc`, weightDoc);

      if (!weightDoc) throw new AppError("Weight not found", 404);

      let centralPrice = 0;
      let centralNumber = 0;
      const indexOfTruck = item.numberOfVehicles.findIndex(
        (item: any) => item.number > 0
      );
      centralPrice = oilPriceDoc.truck[indexOfTruck].value;
      centralNumber = item.numberOfVehicles[indexOfTruck].number;

      sheetData.push([
        parcels.length + 1,
        item.original,
        item.destination,
        oilPriceDoc.distance,
        item.peaCode,
        stockDoc?.description,
        weightDoc?.weight,
        item.quantity,
        item.numberOfVehicles[0].number,
        item.numberOfVehicles[1].number,
        item.numberOfVehicles[2].number,
        centralPrice,
        centralPrice * centralNumber,
        "'นับถัดจากใบสั่งจ้าง",
        item.contract,
        item.distance?.value > 800 ? "4" : "3",
      ]);

      return item;
    })
  );

  const updatedSheet = xlsx.utils.aoa_to_sheet(sheetData as any[][]);
  workbook.Sheets[sheetName] = updatedSheet;

  const buffer = xlsx.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  console.log(`newParcels`, newParcels);
  const originalname = `${title}-${dayjs().format()}.xlsx`;
  const imgObj = (await uploadToS3(originalname, buffer, "planning")) as any;
  planning.xlsxFilename = imgObj.url;
  await Planning.findByIdAndUpdate(planning._id, {
    parcels: newParcels,
    xlsxFilename: imgObj.url,
  });

  await pushMessage("U6252eabcd5b05b07e76de9fe319e5e4e", [
    {
      type: "text",
      text: `New planning ${title} has been created \n 
      -------------------------------------------- \n
      Download file here: ${imgObj.url}`,
    },
  ]);

  res.status(201).json({
    url: imgObj.url,
  });
};

export const updatePlanning = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, date, parcels, status } = req.body;
  const planning = (await Planning.findOne({ _id: id })) as any;
  let isNewStatus = false;

  if (!planning) new AppError("Planning not found", 404);

  if (planning.status !== status) isNewStatus = true;

  let newObj = {
    ...planning,
  };

  delete newObj._id;

  const newPlanning = await Planning.findByIdAndUpdate(
    id,
    {
      ...newObj,
      title,
      description,
      date,
      parcels,
      status,
    },
    { new: true }
  );

  if (isNewStatus) {
    await pushMessage("U6252eabcd5b05b07e76de9fe319e5e4e", [
      {
        type: "text",
        text: `Planning ${title} has been updated to ${status}`,
      },
    ]);
  }

  res.status(200).json(newPlanning);
};
